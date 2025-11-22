import Sequelize from "sequelize";
import config from "./config/config.mjs";

let sequelize;
if (process.env.NODE_ENV === "production") {
    sequelize = new Sequelize(config.production);
} else {
    ///sequelize = new Sequelize(config.production);
    sequelize = new Sequelize(config.development);
}

sequelize.authenticate()
    .then(() => {
        console.log('Connection established.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const connection = sequelize;
export default connection;
