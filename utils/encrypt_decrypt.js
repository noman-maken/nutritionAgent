import CryptoJS from 'crypto-js';
export const encryptedText = (text) => {
    try {
        return  CryptoJS?.AES.encrypt(text, process.env.NEXT_PUBLIC_ENCRYPTED_KEY).toString();
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
};

export const decryptText = (encryptedText) => {
    try {
        return CryptoJS?.AES.decrypt(encryptedText, process.env.NEXT_PUBLIC_ENCRYPTED_KEY).toString(CryptoJS?.enc.Utf8);
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};


