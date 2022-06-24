# Level 6 Authenticate your app with Google

**OAuth stands for Open Authorization**

when you using Google Oauth in your app, you are the client, and Google is the service provider.

to use OAuth , you need to

1. set up your app in Google Developers console, You will get an app id and app secret
1. redirect to Google/Facebook for authentication
3. user log in on google
2. user grant permission on prompt
7. receive Authorization code
3. get an access token to long term multiple access
---
install the package `passport-google-oauth20` and require it in app.js

## 6.1 create an application on Google Developers Console

1. create a project on [Google Developers Console](https://console.developers.google.com/)
1. go the `OAuth Consent Screen` , fill in info such as app name, contact email,
1. go to `credentials` to create `OAuth Client ID`
  1. authorized JavaScript origins: *http://localhost:3000*
  1. authorized redirect URL: *http://localhost:3000/auth/google/secrets*
  1. you will get a client id and client secret, put them in `.env` file

## 6.2 configure Strategy

### 6.2.1 in app.js require package

```JavaScript
//put this on top of code
const GoogleStrategy = require('passport-google-oauth20').Strategy;


//put the following code below serialize and de-serialize code
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,//client id and secret are in .env file for secruity prupose
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
```

### 6.2.2 install and load findOrCreate plugin

```JavaScript
const findOrCreate = require('mongoose-findorcreate');
//put plugin code under created userSchema
userSchema.plugin(findOrCreate);
```

### 6.2.3 create a '/auth/google' get route for the `sign in with google` button

```JavaScript
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));
//we set http://localhost:3000/auth/google/secrets as our callback url.
app.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/secrets');
    });
```

### 6.2.4 update the serialize and de-serialize method

```JavaScript
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
```
