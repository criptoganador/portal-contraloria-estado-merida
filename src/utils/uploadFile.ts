/**
 * Sube un archivo Base64 al servidor y retorna la URL del archivo almacenado como BYTEA.
 * Compatible con datos existentes en Base64 (los deja pasar sin subir).
 */
export async function uploadFile(
  base64: string,
  nombre: string,
  mimeType: string,
  token: string | null
): Promise<string> {
  // Si no hay token o el base64 está vacío, retornar tal cual
  if (!token || !base64) return base64;

  // Si ya es una URL de archivo almacenado, no re-subir
  if (base64.startsWith('/api/files/') || base64.startsWith('http')) return base64;

  // Si es un hash '#' o vacío, no subir
  if (base64 === '#' || base64.trim() === '') return base64;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const res = await fetch(`${API_URL}/files`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ base64, nombre, mimeType }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Error al subir el archivo');
  }

  const data = await res.json();
  // Retornar la URL completa del archivo para usar en src/href
  return `${API_URL}/files/${data.file.id}`;
}

/**
 * Detecta el tipo MIME de un Data URL Base64
 */
export function getMimeFromBase64(base64: string): string {
  const match = base64.match(/^data:([^;]+);base64,/);
  return match ? match[1] : 'application/octet-stream';
}
