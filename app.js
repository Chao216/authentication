//jshint esversion:6
require('dotenv').config()
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
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


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
  password: String,
  googleId:String,
  secret:[String]
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID, //here is from dotenv package
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));



//create a get route

app.get("/", (req, res) => {
  res.render("home")
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));


  app.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/secrets');
    });

app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/register", (req, res) => {
  res.render("register")
})

// create the get route for secrets
app.get("/secrets", (req,res)=>{
  // req.isAuthenticated()?res.render("secrets"): res.redirect("/login") //use isAuthenticated to check if the request is allowed.
User.find({secret:{$ne:null}}, (err, foundUser)=>{
  if (err){
    console.log(err);
  } else {
    if (foundUser){
      console.log(foundUser);
      console.log(typeof foundUser);
      res.render("secrets", {toPass:foundUser})
    }
  }
})
})

//create a sumbit get method

app.get("/submit", (req,res)=>{
  req.isAuthenticated()?res.render("submit"): res.redirect("/login") //use isAuthenticated to check if the request is allowed.
})

//also an post for sumbit

app.post("/submit", (req,res)=>{
  const newSecret = req.body.secret;
  User.findById(req.user.id, (err, fundUser)=>{ //the passport package will bring user info in the req for submit
      if (err){
        console.log(err);
      } else {
        if (fundUser){
          fundUser.secret.push(newSecret);
          fundUser.save(()=>{//an callback to redirect to secrets
            res.redirect("/secrets")
          })
        }
      }
  })
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
