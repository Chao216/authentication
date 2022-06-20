//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));


//create a get route

app.get("/", (req,res)=>{
  res.render("home")
})

app.get("/login", (req,res)=>{
  res.render("login")
})

app.get("/register", (req,res)=>{
  res.render("register")
})






const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log("server started on port" + port);
})
