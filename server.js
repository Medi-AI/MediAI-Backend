const express = require("express");
const cors = require("cors");
const {APP_PORT, DB_URL} = require("./config");
const router = require("./routes/router");
const profileRouter = require("./routes/profileRouter");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandler");

const app = express();

mongoose.connect(DB_URL)
	.then(() => {
		console.log("Connected to DB");
	})
	.catch((err) => {
		console.log(err);
	});

app.use(express.json());
app.use(cors());

app.use(router);
app.use(profileRouter);

app.use(errorHandler);

app.listen(APP_PORT, () => {
	console.log(`Server running on PORT ${APP_PORT}`);
});
