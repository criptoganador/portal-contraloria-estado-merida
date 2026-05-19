const loginAttempts = new Map();

/**
 * Middleware para limitar la velocidad de peticiones de login por dirección IP
 */
export function loginRateLimiter(req, res, next) {
  // Obtener la IP del cliente de forma confiable
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  
  const WINDOW_MS = 15 * 60 * 1000; // Ventana de 15 minutos
  const MAX_ATTEMPTS = 5; // Máximo 5 intentos por ventana

  const now = Date.now();
  const record = loginAttempts.get(ip);

  // Si es la primera petición de esta IP
  if (!record) {
    loginAttempts.set(ip, {
      attempts: 1,
      resetTime: now + WINDOW_MS
    });
    return next();
  }

  // Si la ventana de tiempo ya pasó, reiniciar el contador
  if (now > record.resetTime) {
    record.attempts = 1;
    record.resetTime = now + WINDOW_MS;
    return next();
  }

  // Si ya superó el máximo de intentos permitidos
  if (record.attempts >= MAX_ATTEMPTS) {
    const minutesLeft = Math.ceil((record.resetTime - now) / 60000);
    return res.status(429).json({
      error: `Demasiados intentos de acceso. Por favor, inténtalo de nuevo en ${minutesLeft} ${
        minutesLeft === 1 ? 'minuto' : 'minutos'
      }.`
    });
  }

  // Incrementar el contador de intentos dentro de la ventana activa
  record.attempts += 1;
  next();
}
