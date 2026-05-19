import crypto from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET || 'contraloria_merida_super_secret_key_2026';

// Generar Token JWT nativo (Header.Payload.Signature)
export function signToken(payload) {
  // Configurar expiración a 24 horas por defecto
  const exp = Date.now() + 24 * 60 * 60 * 1000;
  const fullPayload = { ...payload, exp };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

// Verificar Token JWT nativo
export function verifyToken(token) {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));

    // Verificar expiración
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

// Middleware de autenticación para proteger endpoints en Express
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token faltante.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token inválido o expirado.' });
  }

  req.user = decoded; // Adjuntar datos de usuario a la petición
  next();
}
