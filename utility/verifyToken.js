const jwt = require('jsonwebtoken');
const { decryptToken } = require('./aes256Token');

exports.verifyToken = (encryptedToken) => {
    try {
        // Decrypt the token
        const token = decryptToken(encryptedToken);

        // Verify the JWT
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        return decoded; // Return the decoded payload
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
