require("dotenv").config();

const APP_PORT = process.env.APP_PORT;
const DB_URL = process.env.DB_URL;

module.exports = {APP_PORT, DB_URL};
