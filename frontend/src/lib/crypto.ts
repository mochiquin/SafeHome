// This key MUST match the FERNET_KEY in your backend's .env file
const FERNET_KEY = process.env.NEXT_PUBLIC_FERNET_KEY;
const SALT = 'safehome_salt_2024'; // This MUST match the salt in the backend

/**
 * Derives a key from the master key using PBKDF2, matching the backend's key derivation.
 * Uses the Web Crypto API for native browser support.
 */
async function deriveKey(keyString: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(keyString),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Converts a hex string to a Uint8Array.
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Converts a Uint8Array to a hex string.
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Encrypts data using AES-GCM, compatible with the backend's encryption.
 * Uses the Web Crypto API for native browser support.
 *
 * @param data The string data to encrypt.
 * @returns The encrypted string in the format "iv:ciphertext:tag".
 * @throws {Error} If the FERNET_KEY is not set.
 */
export async function enc(data: string): Promise<string> {
  if (!FERNET_KEY) {
    throw new Error('NEXT_PUBLIC_FERNET_KEY environment variable is not set.');
  }

  const key = await deriveKey(FERNET_KEY, SALT);
  const iv = crypto.getRandomValues(new Uint8Array(16)); // Generate a random 16-byte IV
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    dataBytes
  );

  // The encrypted result includes both ciphertext and authentication tag (last 16 bytes)
  const encryptedBytes = new Uint8Array(encrypted);
  const ciphertext = encryptedBytes.slice(0, -16);
  const tag = encryptedBytes.slice(-16);

  const ivHex = bytesToHex(iv);
  const ciphertextHex = bytesToHex(ciphertext);
  const tagHex = bytesToHex(tag);

  return `${ivHex}:${ciphertextHex}:${tagHex}`;
}

/**
 * Decrypts data encrypted with AES-GCM.
 * Uses the Web Crypto API for native browser support.
 *
 * @param encryptedData The encrypted data string in the format "iv:ciphertext:tag".
 * @returns The decrypted string.
 */
export async function dec(encryptedData: string): Promise<string> {
  if (!FERNET_KEY) {
    throw new Error('NEXT_PUBLIC_FERNET_KEY environment variable is not set.');
  }

  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format.');
  }

  const [ivHex, ciphertextHex, tagHex] = parts;
  const key = await deriveKey(FERNET_KEY, SALT);
  const iv = hexToBytes(ivHex);
  const ciphertext = hexToBytes(ciphertextHex);
  const tag = hexToBytes(tagHex);

  // Combine ciphertext and tag for decryption
  const encryptedBytes = new Uint8Array(ciphertext.length + tag.length);
  encryptedBytes.set(ciphertext);
  encryptedBytes.set(tag, ciphertext.length);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedBytes
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
