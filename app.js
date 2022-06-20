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

const encrypt = require("mongoose-encryption");
//load mongoose and connect to database

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB");

//create a user Schema and mongoose model

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "Mr Sherlock Holmes VS Mr Poriot";
userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"]});

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
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save((err) => {
    err ? console.log(err) : res.render("secrets");
  })
})

//create post for login

app.post("/login", (req,res)=>{
  User.findOne({email:req.body.username}, (err,target)=>{
    if (err){console.log(err)} else {
      if (target){
        if(target.password===req.body.password){
          res.render("secrets")
        }
      }
    }
  })
})

    const port = process.env.PORT || 3000;

    app.listen(port, (req, res) => {
      console.log("server started on port" + port);
    });
