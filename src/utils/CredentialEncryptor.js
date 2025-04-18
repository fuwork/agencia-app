// Util usando Web Crypto API compatível com Node.js

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Recebe uma chave base64 de 32 bytes
export async function getKey(secretBase64) {
  const rawKey = Uint8Array.from(atob(secretBase64), c => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(data, secretBase64) {
  const key = await getKey(secretBase64);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = encoder.encode(JSON.stringify(data));

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  return {
    iv: btoa(String.fromCharCode(...iv)),
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertextBuffer)))
  };
}

export async function decrypt({ iv, ciphertext }, secretBase64) {
  const key = await getKey(secretBase64);
  const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
  const ciphertextBytes = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    key,
    ciphertextBytes
  );

  return JSON.parse(decoder.decode(decryptedBuffer));
}
