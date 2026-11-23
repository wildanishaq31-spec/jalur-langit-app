/**
 * Utilitas Enkripsi & Dekripsi Kredensial Admin Jalur Langit
 * 
 * Mengamankan penyimpanan password admin agar tidak tersimpan dalam bentuk
 * teks terbuka (plain-text) di localStorage peramban.
 */

const ENCRYPTION_SALT = 'JalurLangit_Admin_Vault_2026';

/**
 * Enkripsi string teks terbuka menjadi string terenkripsi berformat heksadesimal dengan awalan 'enc:'.
 */
export function encryptPassword(plainText: string): string {
  if (!plainText) return '';
  if (plainText.startsWith('enc:')) return plainText; // Sudah terenkripsi

  const saltLen = ENCRYPTION_SALT.length;
  let hexResult = '';
  for (let i = 0; i < plainText.length; i++) {
    const charCode = plainText.charCodeAt(i);
    const saltCode = ENCRYPTION_SALT.charCodeAt(i % saltLen);
    const encryptedByte = (charCode ^ saltCode) + 13;
    hexResult += encryptedByte.toString(16).padStart(4, '0');
  }
  return `enc:${hexResult}`;
}

/**
 * Dekripsi string terenkripsi kembali ke teks asli.
 * Jika input belum berawalan 'enc:' (misal data lama), kembalikan apa adanya (backward compatibility).
 */
export function decryptPassword(cipherText: string): string {
  if (!cipherText) return '';
  if (!cipherText.startsWith('enc:')) return cipherText; // Fallback plain text

  try {
    const rawHex = cipherText.slice(4);
    const saltLen = ENCRYPTION_SALT.length;
    let result = '';

    for (let i = 0, charIndex = 0; i < rawHex.length; i += 4, charIndex++) {
      const hexChunk = rawHex.slice(i, i + 4);
      const encryptedByte = parseInt(hexChunk, 16);
      if (isNaN(encryptedByte)) return cipherText;
      const charCode = (encryptedByte - 13) ^ ENCRYPTION_SALT.charCodeAt(charIndex % saltLen);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch {
    return cipherText;
  }
}
