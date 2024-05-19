import { importKey, string2Unit8 } from "./encryptKey";

export const encryptMessage = async (message, key, IV) => {
  const importedKey = await importKey(key);
  const encodedMessage = new TextEncoder().encode(message);
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: IV,
    },
    importedKey,
    encodedMessage
  );
  return JSON.stringify(new Uint8Array(encryptedData));
};

export const decryptMessage = async (message, key, IV) => {
  const importedKey = await importKey(key);
  const encryptedData = string2Unit8(message);
  const iv = string2Unit8(IV);
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    importedKey,
    encryptedData.buffer
  );

  return new TextDecoder().decode(decryptedData);
};
