import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import sharp from 'sharp';
import pool from './db.js';
import { signToken, requireAuth } from './auth.js';
import { encrypt, decrypt } from './crypto.js';
import { loginRateLimiter } from './rateLimiter.js';
import { logAudit } from './audit.js';
import { securityHeaders } from './securityHeaders.js';
import { sanitizeBody } from './sanitize.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar cabeceras de seguridad HTTP
app.use(securityHeaders);

// Configurar CORS restringido a orígenes autorizados
const ALLOWED_ORIGINS = [
  'http://localhost:5173',        // Vite dev server
  'http://localhost:4173',        // Vite preview
  'http://localhost:3000',        // Alternativo
  process.env.FRONTEND_URL        // Dominio de producción (ej: https://portal-contraloria.vercel.app)
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Bloqueado por política CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar límites altos de carga para permitir subida de archivos pesados (base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Saneamiento global de entradas para prevenir XSS almacenado
app.use(sanitizeBody);

// ─── ENDPOINT INICIO DE SESIÓN ────────────────────────
app.post('/api/auth/login', loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email.toLowerCase()]);
    if (result.rows.length === 0) {
      await logAudit(req, 'INICIO_SESION_FALLIDO', `Intento fallido de inicio de sesión para el correo: ${email}`, { email });
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar contraseña con PBKDF2 (formato almacenado: 'salt:hash')
    let passwordValid = false;
    if (user.password.includes(':')) {
      // Formato PBKDF2: salt:hash
      const [salt, storedHash] = user.password.split(':');
      const inputHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      passwordValid = (inputHash === storedHash);
    } else {
      // Fallback SHA-256 legacy (por si la migración no se ha ejecutado aún)
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      passwordValid = (hashedPassword === user.password);
    }

    if (!passwordValid) {
      await logAudit(req, 'INICIO_SESION_FALLIDO', `Intento de inicio de sesión con clave incorrecta para: ${email}`, { email, id: user.id });
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = signToken({ id: user.id, email: user.email, nombre: user.nombre });

    await logAudit(req, 'INICIO_SESION_EXITOSO', `Usuario ${user.nombre} (${user.email}) inició sesión correctamente`, { id: user.id, email: user.email });

    res.json({
      success: true,
      token,
      usuario: {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor durante el inicio de sesión' });
  }
});

// ─── ENDPOINTS CONFIGURACIÓN DEL SITIO ────────────────────────
app.get('/api/config', async (req, res) => {
  try {
    const result = await pool.query("SELECT value FROM site_config WHERE key = 'main_config'");
    if (result.rows.length > 0) {
      const config = result.rows[0].value;
      // Desencriptar campos sensibles antes de enviarlos al frontend
      config.contactoDireccion = decrypt(config.contactoDireccion);
      config.contactoTelefono = decrypt(config.contactoTelefono);
      config.contactoEmail = decrypt(config.contactoEmail);
      res.json(config);
    } else {
      res.status(404).json({ error: 'Configuración no encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al obtener la configuración' });
  }
});

app.post('/api/config', requireAuth, async (req, res) => {
  try {
    const newConfig = req.body;
    // Encriptar campos sensibles antes de guardarlos en la base de datos
    const configToSave = {
      ...newConfig,
      contactoDireccion: encrypt(newConfig.contactoDireccion),
      contactoTelefono: encrypt(newConfig.contactoTelefono),
      contactoEmail: encrypt(newConfig.contactoEmail)
    };

    const result = await pool.query(
      "UPDATE site_config SET value = $1 WHERE key = 'main_config' RETURNING value",
      [JSON.stringify(configToSave)]
    );
    if (result.rows.length > 0) {
      const config = result.rows[0].value;
      // Desencriptar campos para la respuesta
      config.contactoDireccion = decrypt(config.contactoDireccion);
      config.contactoTelefono = decrypt(config.contactoTelefono);
      config.contactoEmail = decrypt(config.contactoEmail);
      
      await logAudit(req, 'ACTUALIZAR_CONFIGURACION', 'Se actualizó la configuración general del portal');
      
      res.json({ success: true, config });
    } else {
      res.status(404).json({ error: 'Configuración no encontrada para actualizar' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al guardar la configuración' });
  }
});

// ─── ENDPOINTS NOTICIAS ───────────────────────────────────────
app.get('/api/noticias', async (req, res) => {
  try {
    const { page, limit, search, categoria } = req.query;

    if (!page) {
      // Retrocompatibilidad: Si no hay página, devolver todo como arreglo
      const result = await pool.query("SELECT * FROM noticias ORDER BY fecha DESC, id DESC");
      return res.json(result.rows);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let queryParams = [];
    let whereClauses = [];

    if (search) {
      queryParams.push(`%${search}%`);
      whereClauses.push(`titulo ILIKE $${queryParams.length}`);
    }

    if (categoria && categoria !== 'Todos') {
      queryParams.push(categoria);
      whereClauses.push(`categoria = $${queryParams.length}`);
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countResult = await pool.query(`SELECT COUNT(*) FROM noticias ${whereString}`, queryParams);
    const total = parseInt(countResult.rows[0].count);

    queryParams.push(limitNum, offset);
    const result = await pool.query(
      `SELECT * FROM noticias ${whereString} ORDER BY fecha DESC, id DESC LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
      queryParams
    );

    res.json({
      data: result.rows,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al obtener noticias' });
  }
});

app.post('/api/noticias', requireAuth, async (req, res) => {
  try {
    const { titulo, resumen, contenido, fecha, imagen, categoria, publicada } = req.body;
    const result = await pool.query(
      "INSERT INTO noticias (titulo, resumen, contenido, fecha, imagen, categoria, publicada) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [titulo, resumen, contenido || '', fecha || new Date(), imagen || '', categoria || 'General', publicada !== false]
    );
    await logAudit(req, 'CREAR_NOTICIA', `Se creó la noticia: "${titulo}"`);
    res.status(210).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al crear la noticia' });
  }
});

app.put('/api/noticias/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, resumen, contenido, fecha, imagen, categoria, publicada } = req.body;
    const result = await pool.query(
      "UPDATE noticias SET titulo = $1, resumen = $2, contenido = $3, fecha = $4, imagen = $5, categoria = $6, publicada = $7 WHERE id = $8 RETURNING *",
      [titulo, resumen, contenido, fecha, imagen, categoria, publicada, id]
    );
    if (result.rows.length > 0) {
      await logAudit(req, 'EDITAR_NOTICIA', `Se editó la noticia ID: ${id} ("${titulo}")`);
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Noticia no encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al actualizar la noticia' });
  }
});

app.delete('/api/noticias/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM noticias WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length > 0) {
      await logAudit(req, 'ELIMINAR_NOTICIA', `Se eliminó la noticia ID: ${id} ("${result.rows[0].titulo}")`);
      res.json({ success: true, message: 'Noticia eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Noticia no encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al eliminar la noticia' });
  }
});

// ─── ENDPOINTS DOCUMENTOS ─────────────────────────────────────
app.get('/api/documentos', async (req, res) => {
  try {
    const { page, limit, search, categoria } = req.query;

    if (!page) {
      // Retrocompatibilidad
      const result = await pool.query("SELECT * FROM documentos ORDER BY fecha DESC, id DESC");
      return res.json(result.rows);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let queryParams = [];
    let whereClauses = [];

    if (search) {
      queryParams.push(`%${search}%`);
      whereClauses.push(`titulo ILIKE $${queryParams.length}`);
    }

    if (categoria && categoria !== 'Todos') {
      queryParams.push(categoria);
      whereClauses.push(`categoria = $${queryParams.length}`);
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countResult = await pool.query(`SELECT COUNT(*) FROM documentos ${whereString}`, queryParams);
    const total = parseInt(countResult.rows[0].count);

    queryParams.push(limitNum, offset);
    const result = await pool.query(
      `SELECT * FROM documentos ${whereString} ORDER BY fecha DESC, id DESC LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
      queryParams
    );

    res.json({
      data: result.rows,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al obtener documentos' });
  }
});

app.post('/api/documentos', requireAuth, async (req, res) => {
  try {
    const { titulo, fecha, categoria, archivo, estado } = req.body;
    const result = await pool.query(
      "INSERT INTO documentos (titulo, fecha, categoria, archivo, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [titulo, fecha || new Date(), categoria, archivo || '#', estado || 'Publicado']
    );
    await logAudit(req, 'CREAR_DOCUMENTO', `Se cargó el documento: "${titulo}"`);
    res.status(210).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al subir documento' });
  }
});

app.delete('/api/documentos/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM documentos WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length > 0) {
      await logAudit(req, 'ELIMINAR_DOCUMENTO', `Se eliminó el documento ID: ${id} ("${result.rows[0].titulo}")`);
      res.json({ success: true, message: 'Documento eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Documento no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al eliminar el documento' });
  }
});

// ─── ENDPOINTS VIDEOS (MULTIMEDIA) ────────────────────────────
app.get('/api/videos', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM videos ORDER BY fecha DESC, id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al obtener videos' });
  }
});

app.post('/api/videos', requireAuth, async (req, res) => {
  try {
    const { titulo, descripcion, tipo, src, fecha } = req.body;
    const result = await pool.query(
      "INSERT INTO videos (titulo, descripcion, tipo, src, fecha) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [titulo, descripcion || '', tipo, src, fecha || new Date()]
    );
    await logAudit(req, 'CREAR_VIDEO', `Se registró el video: "${titulo}"`);
    res.status(210).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al registrar video' });
  }
});

app.delete('/api/videos/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM videos WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length > 0) {
      await logAudit(req, 'ELIMINAR_VIDEO', `Se eliminó el video ID: ${id} ("${result.rows[0].titulo}")`);
      res.json({ success: true, message: 'Video eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Video no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al eliminar el video' });
  }
});

app.get('/api/admin/audit', requireAuth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM auditoria ORDER BY fecha DESC LIMIT 500");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al obtener la bitácora de auditoría' });
  }
});

// ─── ENDPOINT CAMBIO DE CONTRASEÑA ────────────────────────────
app.put('/api/admin/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'La contraseña actual y la nueva son obligatorias' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }

    // Obtener el usuario actual desde la base de datos
    const userResult = await pool.query("SELECT * FROM usuarios WHERE id = $1", [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];

    // Verificar la contraseña actual con PBKDF2
    let currentPasswordValid = false;
    if (user.password.includes(':')) {
      const [salt, storedHash] = user.password.split(':');
      const inputHash = crypto.pbkdf2Sync(currentPassword, salt, 100000, 64, 'sha512').toString('hex');
      currentPasswordValid = (inputHash === storedHash);
    } else {
      const hashedPassword = crypto.createHash('sha256').update(currentPassword).digest('hex');
      currentPasswordValid = (hashedPassword === user.password);
    }

    if (!currentPasswordValid) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
    }

    // Hashear la nueva contraseña con PBKDF2
    const newSalt = crypto.randomBytes(32).toString('hex');
    const newHash = crypto.pbkdf2Sync(newPassword, newSalt, 100000, 64, 'sha512').toString('hex');
    const securePassword = `${newSalt}:${newHash}`;

    await pool.query("UPDATE usuarios SET password = $1 WHERE id = $2", [securePassword, user.id]);

    await logAudit(req, 'CAMBIO_CONTRASENA', `El usuario ${user.email} cambió su contraseña`);

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al cambiar la contraseña' });
  }
});
// ─── ENDPOINTS ARCHIVOS BINARIOS (BYTEA) ──────────────────────
app.post('/api/files', requireAuth, async (req, res) => {
  try {
    const { base64, nombre, mimeType } = req.body;
    if (!base64 || !nombre || !mimeType) {
      return res.status(400).json({ error: 'Se requiere base64, nombre y mimeType' });
    }

    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    let buffer = Buffer.from(base64Data, 'base64');
    let finalMimeType = mimeType;
    let finalNombre = nombre;

    // Si es una imagen, la comprimimos y la convertimos a WebP
    if (mimeType.startsWith('image/') && !mimeType.includes('svg')) {
      try {
        buffer = await sharp(buffer)
          .webp({ quality: 80, effort: 4 }) // Compresión agresiva manteniendo buena calidad visual
          .resize({ width: 1920, withoutEnlargement: true }) // Evitar imágenes absurdamente grandes
          .toBuffer();
        finalMimeType = 'image/webp';
        
        // Cambiar la extensión a .webp
        const lastDotIndex = nombre.lastIndexOf('.');
        if (lastDotIndex !== -1) {
          finalNombre = nombre.substring(0, lastDotIndex) + '.webp';
        } else {
          finalNombre = nombre + '.webp';
        }
      } catch (sharpError) {
        console.error('Error al comprimir la imagen, guardando original:', sharpError);
        // Si sharp falla (por formato no soportado u otro motivo), usamos el buffer original
      }
    }

    const result = await pool.query(
      "INSERT INTO archivos_blob (nombre, mime_type, datos, tamano) VALUES ($1, $2, $3, $4) RETURNING id, nombre, mime_type, tamano, created_at",
      [finalNombre, finalMimeType, buffer, buffer.length]
    );

    const file = result.rows[0];
    await logAudit(req, 'SUBIR_ARCHIVO', `Se subió el archivo: "${finalNombre}" (${(buffer.length / 1024).toFixed(1)} KB)`);

    res.status(201).json({
      success: true,
      file: {
        id: file.id,
        nombre: file.nombre,
        mimeType: file.mime_type,
        tamano: file.tamano,
        url: `/api/files/${file.id}`
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al subir el archivo' });
  }
});

app.get('/api/files/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT nombre, mime_type, datos FROM archivos_blob WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    const file = result.rows[0];

    // Configurar cabeceras para servir el archivo binario correctamente
    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.nombre)}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache de 24h para rendimiento
    res.send(file.datos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al obtener el archivo' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de la Contraloría corriendo en http://localhost:${PORT}`);
});
