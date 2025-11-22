export default {
    development: {

        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_DEVELOPMENT,
        // host: "127.0.0.1",
        host: process.env.DB_HOSTNAME_Local,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging:false,
        dialectModule: require('mysql2'),
    },
    secret_key_development: {
        encrypted_secret_key:"qkoieplockakdo03k93103koa93ms03k3jsdiik3"

    },
    secret_key_production: {
        encrypted_secret_key: process.env.NEXT_PUBLIC_ENCRYPTED_KEY

    },

    production: {
        username: process.env.NEXT_PUBLIC_DB_PRODUCTION_USERNAME,
        password: process.env.NEXT_PUBLIC_DB_PASSWORD_PROD,
        database: process.env.NEXT_PUBLIC_DB_NAME_PRODUCTION,
        host: process.env.NEXT_PUBLIC_DB_HOSTNAME,
        port: 3306,
        logging: false,
        dialect: "mysql",
        dialectModule: require('mysql2'),
        encrypted_secret_key: process.env.NEXT_PUBLIC_ENCRYPTED_KEY
    },
};