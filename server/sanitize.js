/**
 * Middleware para sanear (limpiar) entradas de texto y prevenir ataques XSS almacenado
 */

// Patrón para detectar y eliminar etiquetas HTML peligrosas y atributos de eventos
const DANGEROUS_TAGS = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const DANGEROUS_ATTRS = /\s*on\w+\s*=\s*["'][^"']*["']/gi;
const STYLE_INJECTION = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
const IFRAME_TAGS = /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi;
const OBJECT_TAGS = /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi;
const EMBED_TAGS = /<embed\b[^>]*\/?>/gi;

/**
 * Sanea una cadena de texto eliminando contenido potencialmente peligroso
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(DANGEROUS_TAGS, '')      // Eliminar etiquetas <script>
    .replace(STYLE_INJECTION, '')     // Eliminar etiquetas <style>
    .replace(IFRAME_TAGS, '')         // Eliminar etiquetas <iframe>
    .replace(OBJECT_TAGS, '')         // Eliminar etiquetas <object>
    .replace(EMBED_TAGS, '')          // Eliminar etiquetas <embed>
    .replace(DANGEROUS_ATTRS, '')     // Eliminar atributos onclick, onerror, etc.
    .replace(/javascript\s*:/gi, '')  // Eliminar enlaces javascript:
    .replace(/data\s*:\s*text\/html/gi, '') // Eliminar data:text/html
    .trim();
}

/**
 * Sanea un objeto recursivamente, limpiando todos los valores tipo string
 */
export function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(item => sanitizeObject(item));
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
}

/**
 * Middleware Express para sanear automáticamente el body de todas las peticiones POST/PUT
 */
export function sanitizeBody(req, res, next) {
  if (req.body && (req.method === 'POST' || req.method === 'PUT')) {
    req.body = sanitizeObject(req.body);
  }
  next();
}
