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

const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//don't need to require passport-local, it is a dependency


app.use(session({
  secret:"this is just my temporary secret",
  resave:false,
  saveUninitialized:false
}));

//load mongoose and connect to database

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB");

//create a user Schema and mongoose model

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});




const User = new mongoose.model("User", userSchema);




//create a get route

app.get("/", (req, res) => {
  res.render("home")
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/register", (req, res) => {
  res.render("register")
})

//create post for register
app.post("/register", (req, res) => {



});

//create post for login

app.post("/login", (req,res)=>{

});





const port = process.env.PORT || 3000;

    app.listen(port, (req, res) => {
      console.log("server started on port" + port);
    });
