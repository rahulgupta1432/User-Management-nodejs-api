const jwt=require('jsonwebtoken');
const { encryptToken } = require('./aes256Token');

    // jwt.sign({userId,randomness:Math.random(),expiresOn:Date.now()+1*24*60*60*1000,createdOn:Date.now(),isAdmin,role},
    // process.env.JWT_SECRET,{expiresIn:'1d'});
    // (jwt.sign({userId,randomness:Math.random(),expiresOn:Date.now()+1*24*60*60*1000,createdOn:Date.now(),isAdmin,role}
    // ,process.env.JWT_SECRET,{expiresIn:'1d'}));
    
exports.generateToken = async (userId, isAdmin, role) => {
        const payload = {
            userId,
            randomness: Math.random(),
            expiresOn: Date.now() + 1 * 24 * 60 * 60 * 1000,
            createdOn: Date.now(),
            isAdmin,
            role
        };
    
        const secret = process.env.JWT_SECRET;
        const options = { expiresIn: '1d' };
    
        // Generate JWT
        const token = jwt.sign(payload, secret, options);
    
        // Encrypt the token
        return encryptToken(token);
};