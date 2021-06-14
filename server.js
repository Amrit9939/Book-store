const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();

dotenv.config({path:"./config.env"});
require("./db/conn");

app.use(express.json());

app.use(require("./router/auth"));


PORT= process.env.PORT || 5000
app.listen(PORT,function(){
  console.log("server is running on 5000");
});
