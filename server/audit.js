import pool from './db.js';

/**
 * Registra una acción administrativa en la bitácora de auditoría
 * @param {object} req - Objeto Request de Express
 * @param {string} action - Nombre clave de la acción (ej: 'CREAR_NOTICIA')
 * @param {string} details - Descripción detallada del cambio
 * @param {object} [customUserPayload] - Payload de usuario personalizado (usado antes de que requireAuth decodifique el token)
 */
export async function logAudit(req, action, details = '', customUserPayload = null) {
  try {
    let usuarioId = null;
    let usuarioEmail = 'sistema';

    if (customUserPayload) {
      usuarioId = customUserPayload.id || null;
      usuarioEmail = customUserPayload.email || 'sistema';
    } else if (req.user) {
      usuarioId = req.user.id || null;
      usuarioEmail = req.user.email || 'sistema';
    }

    // Extraer la dirección IP del cliente
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'unknown';
    // Si viene una lista de IPs por proxy, tomar la primera
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    await pool.query(
      "INSERT INTO auditoria (usuario_id, usuario_email, accion, detalles, ip) VALUES ($1, $2, $3, $4, $5)",
      [usuarioId, usuarioEmail, action, details, ip]
    );
  } catch (err) {
    console.error('Error al registrar logs de auditoría en Neon:', err.message);
  }
}
