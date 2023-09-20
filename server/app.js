require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("colors");
const authRouter = require("./route/auth.route");
const courseRoute = require("./route/course.route");
const db = require("./config/db");


const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use("/api/auth", authRouter);
app.use("/api/course", courseRoute);

app.listen(
    process.env.PORT,
    () =>
        console.log(`Listening at ${process.env.PORT}`.bgBlue.white)
);
module.exports = app;
