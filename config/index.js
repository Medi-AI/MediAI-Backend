require("dotenv").config();

const APP_PORT = process.env.APP_PORT;
const DB_URL = process.env.DB_URL;
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

module.exports = {
  APP_PORT,
  DB_URL,
  //   CLIENT_ID,
  //   CLIENT_SECRET,
  //   REDIRECT_URI,
  //   REFRESH_TOKEN,
};
