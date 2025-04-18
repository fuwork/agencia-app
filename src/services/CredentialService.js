import { CredentialEncryptor } from '../utils/CredentialEncryptor.js';
import crypto from 'node:crypto';

// Simulando geração de chave segura (256 bits)
const secretKey = crypto.randomBytes(32); 
const secretKeyBase64 = secretKey.toString('base64'); 

const encryptor = new CredentialEncryptor(secretKeyBase64);

const credentials = { user: 'xablau', password: 'xablauloucao' };

const encrypted = encryptor.encrypt(credentials);
console.log('Encrypted:', encrypted);

const decrypted = encryptor.decrypt(encrypted);
console.log('Decrypted:', decrypted);
