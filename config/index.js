require('dotenv').config()

const config = {
    dev : process.env.NODE_ENV !== 'production',
    port : process.env.PORT || 3000,
    // CONFIG
    cors: process.env.CORS,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
    defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD,
    defaultUserPassword: process.env.DEFAULT_USER_PASSWORD,
    authJwtSecret: process.env.AUTH_JWT_SECRET,
    publicApiKeysToken: process.env.PUBLIC_API_KEYS_TOKEN,
    adminApiKeysToken: process.env.ADMIN_API_KEYS_TOKEN,
    
    
}
module.exports = {config}