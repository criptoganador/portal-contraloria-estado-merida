/**
 * Middleware para inyectar cabeceras HTTP de seguridad
 */
export function securityHeaders(req, res, next) {
  // 1. Evitar ataques de clickjacking (impedir incrustar el sitio en iframes)
  res.setHeader('X-Frame-Options', 'DENY');

  // 2. Prevenir sniffing de tipo MIME (el navegador no intentará adivinar el content-type)
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 3. Habilitar HTTPS obligatorio (HSTS) - Válido por 1 año incluyendo subdominios
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 4. Control de Referencia (no enviar datos sensibles a otros dominios)
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 5. Protección XSS para navegadores antiguos
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 6. Restringir el acceso a hardware/sensores del dispositivo del usuario
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // 7. Content Security Policy (CSP)
  // Restringe de dónde el navegador puede descargar recursos (scripts, estilos, fuentes, conexiones).
  const cspPolicies = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Permite la carga de scripts necesarios para React
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Permite fuentes externas de Google Fonts
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:", // Permite imágenes locales y base64/blob para subida de fotos/logos
    "connect-src 'self' http://localhost:5000 https://*.render.com https://*.neon.tech ws://localhost:* ws://127.0.0.1:*", // Conexiones a APIs, base de datos y WebSocket de desarrollo (Vite HMR)
    "frame-ancestors 'none'" // Asegura que ningún sitio pueda incrustar este portal
  ];
  
  res.setHeader('Content-Security-Policy', cspPolicies.join('; '));

  next();
}
