//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));




























const port = process.env.PORT || 3000;

app.listen(port, (req,res)=>{
  console.log("server started on port"+port);
})
