//jshint esversion:6
require('dotenv').config();
const md5 = require("md5");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

const bcrypt = require("bcrypt");
const saltRounds=10;
console.log(process.env.SECRET);


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

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save((err) => {
      err ? console.log(err) : res.render("secrets");
    })
  })

});

//create post for login

app.post("/login", (req,res)=>{
  User.findOne({email:req.body.username}, (err,target)=>{
    if (err){console.log(err)} else {
      if (target){ //we found such a username in our database
        // Load hash from your password DB.
bcrypt.compare(req.body.password, target.password, function(err, result) { //now we compare password clients entered, and the password we found in database

    if (result){res.render("secrets")} // if results is true we render secrets page.
});
      }
    }
  })
})

    const port = process.env.PORT || 3000;

    app.listen(port, (req, res) => {
      console.log("server started on port" + port);
    });
