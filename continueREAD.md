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
