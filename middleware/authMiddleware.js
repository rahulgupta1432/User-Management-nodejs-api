const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');
const { decryptToken } = require('../utility/aes256Token');
const ErrorHandler = require('../utility/ErrorHandler');

exports.Auth = async (req, res, next) => {
    const token = req.headers['x-authorization'];

    if (token) {
        try {
            // Decrypt the token
            const decryptedToken = decryptToken(token);
            // console.log('Decrypted Token:', decryptedToken); 

            // Verify the JWT
            const decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET);

            // Token expiration check
            if (decoded.expiresOn < Date.now()) {
                return res.status(401).json({
                    status: 'fail',
                    code: 401,
                    message: 'Not Authorized, Token Expired',
                    data: [],
                });
            }

            // Extract the user role and ID from the decoded token
            const { role, userId ,isAdmin} = decoded;
            let user = '';

            // Find the user based on the decoded userId
            user = await User.findOne({ where: { id: userId ,role:role,isAdmin:isAdmin} });
            // console.log("user",userId,role)
            if (!user) {
                return res.status(401).json({
                    status: 'fail',
                    code: 401,
                    message: 'Not Authorized, Invalid User',
                    data: {},
                });
            }
            if(user.isDeleted){
              return next(new ErrorHandler("User Deleted, Please Contact to the Admin",404));
          }
          if (user.tokenVersion !== decoded.tokenVersion) {
            return next(new ErrorHandler("Token is invalid or has been logged out",401))
        }
        req.user = user;

            next();
        } catch (error) {
            console.log('Token Error:', error.message)
            console.log("error",error)
            return res.status(401).json({
                status: 'fail',
                code: 401,
                message: 'Not Authorized, token failed',
                data: {},
            });
        }
    } else {
        return res.status(401).json({
            status: 'fail',
            code: 401,
            message: 'Not Authorized, no token',
            data: {},
        });
    }
};

exports.admin = (req, res, next) => {
  if (req.user &&req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: "fail",
      code: 401,
      message: "Not Authorized, As a Admin",
      data: {},
    
    })
  }
};
