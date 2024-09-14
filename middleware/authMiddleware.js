const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');
const { decryptToken } = require('../utility/aes256Token');

exports.Auth = async (req, res, next) => {
    const token = req.headers['x-authorization'];

    if (token) {
        try {
            // Decrypt the token
            const decryptedToken = decryptToken(token);
            console.log('Decrypted Token:', decryptedToken); 

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
            const { role, userId } = decoded;
            let user = '';

            // Find the user based on the decoded userId
            user = await User.findOne({ where: { id: userId ,role:role} });
            console.log("user",userId,role)
            if (!user) {
                return res.status(401).json({
                    status: 'fail',
                    code: 401,
                    message: 'Not Authorized, Invalid User',
                    data: {},
                });
            }

            req.user = user;
            console.log('Token Auth');

            // Call the next middleware function
            next();
        } catch (error) {
            console.log('Token Error:', error.message)
            console.log("error",error)
            // If the token is invalid or decryption fails, return a 401 unauthorized response
            return res.status(401).json({
                status: 'fail',
                code: 401,
                message: 'Not Authorized, token failed',
                data: {},
            });
        }
    } else {
        // If the token is missing, return a 401 unauthorized response
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


exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the header

  // Check if no token is provided
  if (token == null) {
      return res.status(500).json({
          success: false, 
          message: "Bearer token not provided in the header"
      }); // Custom error response for unauthorized access
  }

  // Hardcoded token for comparison
  const hardcodedToken = "f8946gntyw84769gt8y869yjh8597";

  // Compare the provided token to the hardcoded token
  if (token === hardcodedToken) {
      // Proceed if tokens match
      next();
  } else {
      // If tokens do not match, verify the token normally
      return res.status(500).json({
        success: false, 
        message: "not authorized"
    }); 
  }
};


/**
 * Middleware function to check if the user has the required permissions to access a URL.
 *
 * @returns {Function} The middleware function.
 */
async function allowIfPermission(req, res,next) {
  // Ensure user and user's permissions are defined
  if (!req.user || !req.user.permissions || !Array.isArray(req.user.permissions)) { 
    return res.status(401).json({
      status: 'fail',
      code: 401,
      message: 'Not Authorized, Access Denied'
    });
  }

  // Retrieve the required permissions for the URL
  const permissionsRequired = mapUrlToPermissions(req.originalUrl);
  
  // Check if the user has any of the required permissions
  const hasPermission = permissionsRequired.some(permission => req.user.permissions.includes(permission));
  
  if (!hasPermission) { 
    return res.status(401).json({  
      status: 'fail',
      code: 401,
      message: 'Not Authorized, Access Denied'
    });
  }
  next();
};


/**
 * Maps URLs to specific permissions.
 *
 * @param {string} url - The URL to map.
 * @return {Array} An array of permissions associated with the URL.
 *                 If no permissions are found, an empty array is returned.
 */
function mapUrlToPermissions(url) {
  // Define the mappings of URL prefixes to permissions
  console.log(url)
  const mappings = {
      '/api/v1/transaction/': ['manage_transaction', 'all_access'],
      '/api/v1/merchant': ['manage_account', 'all_access'],
      '/api/v1/merchant/subscribed': ['manage_account', 'all_access'],
      '/api/v1/merchant/onboard-merchant': ['manage_account', 'all_access'],
      '/api/v1/merchant/delete-merchant': ['manage_account', 'all_access'],
      '/api/v1/merchant/activate-merchant': ['manage_account', 'all_access'],
      '/api/v1/merchant/deactive/all/merchant-account': ['manage_account', 'all_access'],
      '/api/v1/merchant/fetch/deleted-account': ['manage_account', 'all_access'],
      '/api/v1/merchant/restore/deleted-account': ['manage_account', 'all_access'],
      '/api/v1/merchant/create-api-key': ['manage_apiKey', 'all_access'],
      '/api/v1/merchant/callback/': ['manage_apiKey', 'all_access'],
      '/api/v1/merchant/callback': ['manage_apiKey', 'all_access'], 
      '/api/v1/merchant/fetch/api-key-details': ['manage_apiKey', 'all_access'],
      '/api/v1/merchant/delete/api-key': ['manage_apiKey', 'all_access'],
      '/api/v1/merchant/update/api-key': ['manage_apiKey', 'all_access'],
      '/api/v1/merchant/update/app-details': ['manage_apiKey', 'all_access'],
      '/api/v1/merchant/fetch/all/call-back': ['manage_apiKey', 'all_access'],
      '/api/v1/merchant/upload/documents': ['manage_KYCDoc', 'all_access'],
      '/api/v1/merchant/fetch/document': ['manage_KYCDoc', 'all_access'],
      '/api/v1/merchant/fetch/all/company-name': ['manage_KYCDoc', 'all_access'],
      '/api/v1/merchant/account/verification': ['manage_account', 'all_access'],
      '/api/v1/merchant/fetch/account-details': ['manage_account', 'all_access'],
      '/api/v1/merchant/admin/upload-document': ['manage_KYCDoc', 'all_access'],
      '/api/v1/merchant/create/merchant-settlement': ['manage_transactions', 'all_access'],
      '/api/v1/merchant/fetch/merchant-settlement': ['manage_transactions','all_access'],
      '/api/v1/adminBank/add-admin-bank': ['manage_account', 'all_access'],
     '/api/v1/adminBank/get-all-admin-banks': ['manage_account', 'all_access'],
     '/api/v1/adminBank/update-admin-bank-status': ['manage_account', 'all_access'],
     '/api/v1/wallet/add-funds': ['manage_wallet', 'all_access'],
     '/api/v1/wallet/get-passbook': ['manage_wallet', 'all_access'],
     '/api/v1/wallet/get-wallet-balance': ['manage_wallet', 'all_access'],
     '/api/v1/wallet/recharge': ['manage_wallet', 'all_access'],
     '/api/v1/price/create-price': ['manage_subscription', 'all_access'],
     '/api/v1/price/get-price-by-merchant': ['manage_subscription', 'all_access'],
     '/api/v1/price/update/price-plan': ['manage_subscription', 'all_access'],
     '/api/v1/price/delete/price-plan': ['manage_subscription', 'all_access'],
     '/api/v1/price/get-all-transactions': ['manage_subscription', 'all_access'],
     '/api/v1/price/get-single-transaction': ['manage_subscription', 'all_access'],
     '/api/v1/transaction/initiate-transaction': ['manage_transactions', 'all_access'],
     '/api/v1/transaction/remove-transaction': ['manage_transactions', 'all_access'], 
     '/api/v1/transaction/get-transactions-stats': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/get-transactions-graph': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/get-transactions-progress-bar': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/fetch/transaction-status': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/status-of-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/status-of-transaction/update': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/collect-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/request-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/fetch/transaction-stats': ['manage_transactions', 'all_access'],
    '/api/v1/merchant/sandbox/fetch/api-key-details' : ['manage_apiKey', 'all_access'],
    '/api/v1/merchant/sandbox/create-api-key' : ['manage_apiKey', 'all_access'],
    '/api/v1/transaction/redirect/status-of-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/transaction-mark-as-failed': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/transaction-status/quick-update': ['manage_transactions', 'all_access'],
    '/api/v1/merchant/sandbox': ['manage_account', 'all_access'],
    '/api/v1/merchant/sandbox/subscribed': ['manage_account', 'all_access'],
    '/api/v1/merchant/sandbox/onboard-merchant': ['manage_account', 'all_access'],
    '/api/v1/merchant/sandbox/delete-merchant': ['manage_account', 'all_access'],
    '/api/v1/merchant/sandbox/activate-merchant': ['manage_account', 'all_access'],
    '/api/v1/merchant/sandbox/deactive/all/merchant-account': ['manage_account', 'all_access'],
    '/api/v1/merchant/sandbox/fetch/deleted-account': ['manage_account', 'all_access'],
    '/api/v1/merchant/sandbox/restore/deleted-account': ['manage_account', 'all_access'],
    '/api/v1/merchant/sandbox/create-api-key': ['manage_apiKey', 'all_access'],
    '/api/v1/merchant/sandbox/callback': ['manage_apiKey', 'all_access'],
    '/api/v1/merchant/sandbox/details': ['manage_apiKey', 'all_access'],
    '/api/v1/merchant/sandbox/fetch/api-key-details': ['manage_apiKey', 'all_access'],
    '/api/v1/merchant/sandbox/delete/api-key': ['manage_apiKey', 'all_access'],
    '/api/v1/merchant/sandbox/update/api-key': ['manage_apiKey', 'all_access'],
    '/api/v1/merchant/sandbox/update/app-details': ['manage_apiKey', 'all_access'],
    '/api/v1/merchant/sandbox/fetch/all/call-back': ['manage_apiKey', 'all_access'],
    '/api/v1/merchant/sandbox/upload/documents': ['manage_KYCDoc', 'all_access'],
    '/api/v1/merchant/sandbox/fetch/document': ['manage_KYCDoc', 'all_access'],
    '/api/v1/merchant/sandbox/account/verification': ['manage_account', 'all_access'],
    '/api/v1/merchant/sandbox/fetch/account-details': ['manage_account', 'all_access'],
    '/api/v1/merchant/sandbox/admin/upload-document': ['manage_KYCDoc', 'all_access'],
    '/api/v1/merchant/sandbox/create/merchant-settlement': ['manage_transactions', 'all_access'],
    '/api/v1/merchant/sandbox/fetch/merchant-settlement': ['manage_transactions','all_access'],

    '/api/v1/transaction/sandbox/get-all-transactions': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/get-single-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/update-transaction-status': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/initiate-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/remove-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/get-transactions-stats': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/get-transactions-graph': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/get-transactions-progress-bar': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/status-of-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/status-of-transaction/update': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/collect-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/request-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/redirect/status-of-transaction': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/transaction-status': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/transaction-mark-as-completed': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/transaction-mark-as-failed': ['manage_transactions', 'all_access'],
    '/api/v1/transaction/sandbox/fetch/transaction-status': ['manage_transactions', 'all_access'],
    '/api/v1/merchant/backend/switch': ['manage_account', 'all_access'],
    '/api/v1/bank/get-bank': ['manage_account', 'all_access'],
    
  };
  let basePath = url.split('?')[0];
  if (mappings.hasOwnProperty(basePath)) {
    return mappings[basePath];
  }
  let cleanPath = basePath.replace(/\/[^\/]+$/, '');
  console.log(cleanPath)
  // Check each URL prefix in the mapping to see if the request starts with this prefix
  if (mappings.hasOwnProperty(cleanPath)) {
    return mappings[cleanPath];
  }
  return [];
}

