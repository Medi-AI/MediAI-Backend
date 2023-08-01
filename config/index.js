require("dotenv").config();

const APP_PORT = process.env.APP_PORT || 5000;
const DB_URL = process.env.DB_URL;

const jwtPrivateKey = process.env.jwtPrivateKey;

GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

module.exports = {
  APP_PORT,
  DB_URL,
  jwtPrivateKey,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
};
