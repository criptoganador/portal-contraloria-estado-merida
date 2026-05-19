import pg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras SSL de Neon
  }
});

// Inicializar la base de datos con tablas y datos semilla por defecto si no existen
async function initDB() {
  const client = await pool.connect();
  try {
    console.log("Iniciando conexión con Neon PostgreSQL e inicializando tablas...");

    // 1. Tabla de configuración
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_config (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        value JSONB NOT NULL
      );
    `);

    // Semilla de configuración si está vacía
    const configRes = await client.query("SELECT * FROM site_config WHERE key = 'main_config'");
    if (configRes.rows.length === 0) {
      const defaultConfig = {
        titulo: 'Contraloría del',
        subtitulo: 'Estado Mérida',
        logoBase64: '',
        navColor: '#172554',
        heroTitulo: 'Transparencia y Control Fiscal',
        heroTexto: 'Órgano de control fiscal del Estado Mérida, comprometido con la vigilancia de los recursos públicos, la rendición de cuentas y el fortalecimiento de la gestión pública.',
        heroImagenesBase64: [],
        contactoDireccion: 'Av. 3 Independencia, Edificio Contraloría del Estado, Mérida, Estado Mérida, Venezuela',
        contactoTelefono: '(0274) 252-5555 / 252-6666',
        contactoEmail: 'contacto@contraloriaestadomerida.gob.ve',
        contactoHorario: 'Lunes a Viernes: 8:00 AM – 4:00 PM',
        redesFacebook: '',
        redesTwitter: '',
        redesInstagram: '',
        redesYoutube: '',
        botonesAcceso: [
          { label: 'Control Fiscal', desc: 'Vigilancia y fiscalización', to: '/competencias', color: 'bg-blue-600', icono: 'Shield' },
          { label: 'Marco Legal', desc: 'Gacetas y resoluciones', to: '/marco-legal', color: 'bg-emerald-600', icono: 'FileText' },
          { label: 'Rendición de Cuentas', desc: 'Transparencia pública', to: '/institucion', color: 'bg-amber-600', icono: 'BarChart3' },
          { label: 'Atención Ciudadana', desc: 'Contacto y denuncias', to: '/contacto', color: 'bg-purple-600', icono: 'Users' }
        ]
      };
      await client.query(
        "INSERT INTO site_config (key, value) VALUES ($1, $2)",
        ['main_config', JSON.stringify(defaultConfig)]
      );
      console.log("Configuración inicial por defecto insertada.");
    }

    // 2. Tabla de noticias
    await client.query(`
      CREATE TABLE IF NOT EXISTS noticias (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        resumen TEXT NOT NULL,
        contenido TEXT,
        fecha DATE NOT NULL,
        imagen TEXT,
        categoria VARCHAR(100) NOT NULL,
        publicada BOOLEAN DEFAULT TRUE
      );
    `);

    // Asegurar que la columna contenido existe si la tabla ya estaba creada
    await client.query(`
      ALTER TABLE noticias ADD COLUMN IF NOT EXISTS contenido TEXT;
    `);

    // Semilla de noticias si está vacía
    const noticiasRes = await client.query("SELECT * FROM noticias");
    if (noticiasRes.rows.length === 0) {
      const mockNoticias = [
        {
          titulo: 'Contraloría inicia auditoría a la gestión fiscal del ejercicio 2025',
          resumen: 'El órgano contralor dio inicio a las actuaciones de control fiscal correspondientes al ejercicio económico financiero 2025, abarcando los entes y organismos del poder público estadal.',
          contenido: 'El órgano contralor dio inicio a las actuaciones de control fiscal correspondientes al ejercicio económico financiero 2025, abarcando los entes y organismos del poder público estadal. El objetivo es evaluar el cumplimiento de las metas físicas y financieras de dichos organismos.',
          fecha: '2026-05-15',
          imagen: '',
          categoria: 'Auditoría',
          publicada: true
        },
        {
          titulo: 'Jornada de capacitación sobre rendición de cuentas para funcionarios públicos',
          resumen: 'Se llevó a cabo una jornada de formación dirigida a los responsables de la administración activa sobre los procesos de rendición de cuentas ante el órgano contralor estadal.',
          contenido: 'Se llevó a cabo una jornada de formación dirigida a los responsables de la administración activa sobre los procesos de rendición de cuentas ante el órgano contralor estadal. La capacitación contó con la participación de ponentes especializados de la Contraloría.',
          fecha: '2026-05-10',
          imagen: '',
          categoria: 'Formación',
          publicada: true
        },
        {
          titulo: 'Publicada la Resolución de Normas para la Declaración Jurada de Patrimonio',
          resumen: 'La Contraloría del Estado Mérida publica las normas actualizadas que regulan la presentación de la Declaración Jurada de Patrimonio por parte de los funcionarios públicos estadales.',
          contenido: 'La Contraloría del Estado Mérida publica las normas actualizadas que regulan la presentación de la Declaración Jurada de Patrimonio por parte de los funcionarios públicos estadales. Esto forma parte de los esfuerzos de modernización y control preventivo.',
          fecha: '2026-05-05',
          imagen: '',
          categoria: 'Normativa',
          publicada: true
        }
      ];
      for (const n of mockNoticias) {
        await client.query(
          "INSERT INTO noticias (titulo, resumen, contenido, fecha, imagen, categoria, publicada) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [n.titulo, n.resumen, n.contenido, n.fecha, n.imagen, n.categoria, n.publicada]
        );
      }
      console.log("Noticias semilla insertadas.");
    }

    // 3. Tabla de documentos legales
    await client.query(`
      CREATE TABLE IF NOT EXISTS documentos (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        fecha DATE NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        archivo TEXT NOT NULL,
        estado VARCHAR(20) DEFAULT 'Publicado'
      );
    `);

    // Asegurar que la columna estado existe si la tabla ya estaba creada
    await client.query(`
      ALTER TABLE documentos ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'Publicado';
    `);

    // Semilla de documentos si está vacía
    const docsRes = await client.query("SELECT * FROM documentos");
    if (docsRes.rows.length === 0) {
      const mockDocs = [
        {
          titulo: 'Ley Orgánica de la Contraloría General de la República y del Sistema Nacional de Control Fiscal',
          fecha: '2024-12-15',
          categoria: 'Gaceta',
          archivo: '#',
          estado: 'Publicado'
        },
        {
          titulo: 'Resolución N° 001-2026 - Normas para la Rendición de Cuentas',
          fecha: '2026-01-20',
          categoria: 'Resolución',
          archivo: '#',
          estado: 'Publicado'
        },
        {
          titulo: 'Providencia Administrativa N° 012 - Declaración Jurada de Patrimonio',
          fecha: '2026-02-10',
          categoria: 'Providencia',
          archivo: '#',
          estado: 'Publicado'
        }
      ];
      for (const d of mockDocs) {
        await client.query(
          "INSERT INTO documentos (titulo, fecha, categoria, archivo, estado) VALUES ($1, $2, $3, $4, $5)",
          [d.titulo, d.fecha, d.categoria, d.archivo, d.estado]
        );
      }
      console.log("Documentos semilla insertados.");
    }

    // 4. Tabla de videos
    await client.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        tipo VARCHAR(20) NOT NULL,
        src TEXT NOT NULL,
        fecha DATE NOT NULL
      );
    `);

    // 5. Tabla de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nombre VARCHAR(100)
      );
    `);

    // 6. Tabla de auditoría
    await client.query(`
      CREATE TABLE IF NOT EXISTS auditoria (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        usuario_email VARCHAR(100),
        accion VARCHAR(100) NOT NULL,
        detalles TEXT,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip VARCHAR(45)
      );
    `);

    // 7. Tabla de archivos binarios (BYTEA) para almacenamiento optimizado
    await client.query(`
      CREATE TABLE IF NOT EXISTS archivos_blob (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        datos BYTEA NOT NULL,
        tamano INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const userRes = await client.query("SELECT * FROM usuarios");
    if (userRes.rows.length === 0) {
      // Generar salt aleatorio y hashear con PBKDF2 (100,000 iteraciones)
      const salt = crypto.randomBytes(32).toString('hex');
      const hash = crypto.pbkdf2Sync('admin123', salt, 100000, 64, 'sha512').toString('hex');
      const securePassword = `${salt}:${hash}`;
      await client.query(
        "INSERT INTO usuarios (email, password, nombre) VALUES ($1, $2, $3)",
        ['admin@contraloria.gob.ve', securePassword, 'Administrador']
      );
      console.log("Usuario administrador semilla insertado (PBKDF2).");
    } else {
      // Migrar contraseñas SHA-256 antiguas a PBKDF2 si es necesario
      for (const user of userRes.rows) {
        if (!user.password.includes(':')) {
          // Es un hash SHA-256 antiguo (64 caracteres hex sin separador ':')
          // Re-hashear la contraseña por defecto con PBKDF2
          const salt = crypto.randomBytes(32).toString('hex');
          const hash = crypto.pbkdf2Sync('admin123', salt, 100000, 64, 'sha512').toString('hex');
          const securePassword = `${salt}:${hash}`;
          await client.query(
            "UPDATE usuarios SET password = $1 WHERE id = $2",
            [securePassword, user.id]
          );
          console.log(`Contraseña del usuario ${user.email} migrada a PBKDF2.`);
        }
      }
    }

    console.log("Tablas verificadas e inicializadas correctamente en Neon.");
  } catch (err) {
    console.error("Error al inicializar la base de datos:", err);
  } finally {
    client.release();
  }
}

initDB();

export default pool;
