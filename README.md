# Authentication for your website

### level 1 authentication with password email store din MongoDB


do not explicitly create a `app.get("secrets")` route, instead `res.render("secrets")` after they submit in register page.

create a Database and User collection with Mongoose Schema and model, save the `req.body.username` and `req.body.password` as a new user document to the database.

create post method for register , after saving their email and password, render secrets page.
again create a post method for login, if no error and find username match a record in DB, also if password match record's password, render the secrets page.


### level 2 encryption for your password in your database

#### mongoose-encryption is a npm package for encrypte MongoDB

install and require mongoose-encryption package

add the encrypt package as a plugin for mongoose.

```javascript
var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;
userSchema.plugin(encrypt, { secret: secret , encryptedFields:["password"]});
```
note , put the plugin after Schema and before Model. to optionally encrypt files, add `encryptedFields:["password"]`

mongoose-encryption will encrypt when save(), and decrypt when find().


### environment variable

use node package `dotenv`

and put this on top of you app.
```javascript
require('dotenv').config()
```

touch a `.env` file in root folder of the project.

put your key value pairs in `.env`

```
# This is a comment
SECRET_KEY=YOURSECRETKEYGOESHERE # comment
SECRET_HASH="something-with-a-#-hash"
```
to fetch the value in .env  you can call with `process.env.KEY`

### level 3 hashing password

has function is almost impossible to reverse at current computing power

install `md5` package and require it

just use `md5` as a method to hash your info
```javascript
const newUser = new User({
  email: req.body.username,
  password: md5(req.body.password)
});
```
the password stored in db will be like `d8578edf8458ce06fbc5bb76a58c5ca4`

the trick for login is also `md5` the password user imputed.

```javascript
app.post("/login", (req,res)=>{
  User.findOne({email:req.body.username}, (err,target)=>{
    if (err){console.log(err)} else {
      if (target){
        if(target.password===md5(req.body.password)){
          res.render("secrets")
        }
      }
    }
  })
})
```

### level 4 hashing and slating.


salting means append  a randomly generated set of string to your password before the hash function.

install and require `bcrypt` and set value for saltRounds.

```javascript
const bcrypt = require("bcrypt");
const saltRounds=10;
```
the hash value is accessible in the callback function

```javascript
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
});
```

in our case, our plainPassword is `req.body.password`, and we use the hash in callback function to save new user document.

```javascript
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
```

for login route we can check the hash

```javascript
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});
```

in our app it looks like

```javascript
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
```


### level 5 cookies and sessions

when client makes a specific post request to server, the server will send cookies to client. in future, when client send get request to server again, the cookies will go to server also.

session is period of time you don't need to re-enter your password to browse the website.

after login session starts and cookies created, after logout, session over and cookies destoried,

##### packages for this lesson
1. passport
2. passport-local
3. passport-local-mongoose
4. express-session

install and require them

```javascript
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//don't need to require passport-local, it is a dependency
```

use the session package before mongoose connect

```javascript
app.use(session({
  secret:"this is just my temporary secret",
  resave:false,
  saveUninitialized:false
}));
```

and then append follwing for passport packages  
```javascript
app.use(passport.initialize());
app.use(passport.session());

```
add the plugin between mongooseChema and Model
```javascript
const User = new mongoose.model("User", userSchema);
```

the next step is about serialize , put this after the mongoose model we created

```javascript
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```
