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

app.use(passport.initialize());
app.use(passport.session());
//load mongoose and connect to database

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB");

//create a user Schema and mongoose model

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



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

// create the get route for secrets
app.get("/secrets", (req,res)=>{
  req.isAuthenticated()?res.render("secrets"): res.redirect("/login") //use isAuthenticated to check if the request is allowed.
})

//create a app.get() for logout

app.get('/logout', (req, res)=>{
  req.logout(function(err){ //logout requires a callback function 
    if (err){
      console.log(err);
    } else {res.redirect('/')}
  });

});

//create post for register
app.post("/register", (req, res) => {

User.register({username:req.body.username}, req.body.password, (err,user)=>{//the register method take 3 params, username, passowrd, and an callback function.
  if (err) {
    console.log(err);
    res.redirect("/register")
  } else {
    passport.authenticate("local")(req,res, ()=>{ //use local for authenticate method, callback function to redirect to "/secrets"
      res.redirect("/secrets")
    })
  }

})


});

//create post for login

app.post("/login", (req,res)=>{

  const user = new User ({
    username:req.body.username,
    password:req.body.password
  })

  req.login(user, (err)=>{
    err? console.log(err):passport.authenticate("local")(req,res, ()=>{
      res.render("secrets")
    })
  })


});





const port = process.env.PORT || 3000;

    app.listen(port, (req, res) => {
      console.log("server started on port" + port);
    });
