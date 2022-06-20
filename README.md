# Authentication for your website

### level 1 authentication with password email store din MongoDB


do not explicitly create a `app.get("secrets")` route, instead `res.render("secrets")` after they submit in register page.

create a Database and User collection with Mongoose Schema and model, save the `req.body.username` and `req.body.password` as a new user document to the database.
