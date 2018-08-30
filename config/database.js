const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)

// Export config object
module.exports = {
  // uri: 'mongodb://localhost:27017/mean-angular-2', // Databse URI and database name
  uri: 'mongodb://irtaza:irtaza1@ds135852.mlab.com:35852/mean-stack', //production database
  secret: crypto, // Cryto-created secret
  db: 'mean-stack' // Database name
}
