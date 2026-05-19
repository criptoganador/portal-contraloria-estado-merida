import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_RAW = process.env.ENCRYPTION_KEY || 'contraloria_merida_super_secret_enc_key_2026';
// Derivar una clave de exactamente 32 bytes (256 bits) usando SHA-256
const ENCRYPTION_KEY = crypto.createHash('sha256').update(SECRET_RAW).digest();

/**
 * Encripta un texto en texto plano a formato cifrado (hexadecimal con IV)
 * @param {string} text - Texto a encriptar
 * @returns {string} - Texto cifrado con el IV prefijado
 */
export function encrypt(text) {
  if (!text || typeof text !== 'string') return text || '';
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (err) {
    console.error('Error al encriptar:', err);
    return text;
  }
}

/**
 * Desencripta un texto cifrado de vuelta a texto plano
 * @param {string} cipherText - Texto cifrado (formato IV:encrypted)
 * @returns {string} - Texto original desencriptado
 */
export function decrypt(cipherText) {
  if (!cipherText || typeof cipherText !== 'string') return cipherText || '';
  try {
    const parts = cipherText.split(':');
    // Si no contiene el separador ':' del IV, asumimos que no está cifrado
    if (parts.length !== 2) return cipherText;

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    // Si falla la desencriptación (ej. datos no cifrados previamente), devolver original
    return cipherText;
  }
}
