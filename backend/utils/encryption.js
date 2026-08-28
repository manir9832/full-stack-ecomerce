const crypto = require("crypto");

const algorithm = "aes-256-gcm";

const key = Buffer.from(
    process.env.AADHAAR_ENCRYPTION_KEY,
    "utf8"
);

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        algorithm,
        key,
        iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");

    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
        encryptedData: encrypted,
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
    };
};

const decrypt = (encryptedData, iv, authTag) => {
    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(
        encryptedData,
        "hex",
        "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
};

module.exports = {
    encrypt,
    decrypt,
};