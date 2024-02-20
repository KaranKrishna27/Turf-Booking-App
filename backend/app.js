const express = require("express");
const app = express();
const bodyParser = require("body-parser")

const connectDB = require("./config/db");

connectDB();

app.use(express.json())

app.use(bodyParser.urlencoded({extended:false}))

module.exports = app;