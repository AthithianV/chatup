export const generateKey = async () => {
  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const exportKey = await window.crypto.subtle.exportKey("raw", key);
  const keyArray = new Uint8Array(exportKey);
  return JSON.stringify(keyArray);
};

export const importKey = async (keyArray) => {
  const data = string2Unit8(keyArray);
  const importKey = await window.crypto.subtle.importKey(
    "raw",
    data,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
  return importKey;
};

export const string2Unit8 = (data) => {
  return new Uint8Array(Object.values(JSON.parse(data)));
};
