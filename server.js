const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const bodyParser = require("body-parser");

const { APP_PORT, DB_URL } = require("./config");

const router = require("./routes/router");
const errorHandler = require("./middleware/errorHandler");

const app = express();

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(
  cors({
    exposedHeaders: ["mediai-auth-token"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(router);
app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(`Server running on PORT ${APP_PORT}`);
});
