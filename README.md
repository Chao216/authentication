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
