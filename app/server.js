'use strict';

const express = require('express');
const serveStatic = require('serve-static');

const homeRoutes = require('./routes/home');
const oauthRoutes = require('./routes/strava-oauth');
const passport = require('passport');
const StravaStrategy = require('passport-strava-oauth2').Strategy
const layout = require('express-layout');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

app.use(serveStatic('public', {'index': 'index.html'}));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({
  secret: 'words kjjjlkjjhkjh9888977',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ url: 'mongodb://localhost:27017/hot_laps_dev' })
}));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(layout());
app.use(passport.initialize());
app.use(passport.session());

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Strava profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  console.log("** serializingUser", user.displayName);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("** DeserializingUser", obj.displayName);
  done(null, obj);
});

//mike passport configs.... move somplace else
passport.use(new StravaStrategy({
    clientID: 16365,
    clientSecret: '3d8533f1a115b1f4e3903548be891daa77a2fa33',
    callbackURL: "http://www.agileedge.com:3001/auth/strava/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("Strava Passport Strategy Called");
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Strava profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Strava account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


// authentication
// from basic passport docs
// app.post('/login',
//   passport.authenticate('local', { successRedirect: '/',
//     failureRedirect: '/login',
//     successFlash: 'Welcome to Hot Laps',
//     failureFlash: true })
// );
//


app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});


// GET /auth/strava
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Strava authentication will involve
//   redirecting the user to strava.com.  After authorization, Strava
//   will redirect the user back to this application at /auth/strava/callback
app.get('/auth/strava',
  passport.authenticate('strava', { scope: ['public'] }),
  function(req, res){
    // The request will be redirected to Strava for authentication, so this
    // function will not be called.
  });

// GET /auth/strava/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/strava/callback',
  passport.authenticate('strava', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// END authentication

app.get('/hello', function (req, res) {
  res.send('Hello World');
});

app.get('/', ensureAuthenticated, homeRoutes.show);
app.get('/test', ensureAuthenticated, homeRoutes.show);
app.get('/strava_auth', oauthRoutes.oauth);

const server = app.listen(3000, function () {
  const host = server.address().address
  const port = server.address().port

  console.log("!!!Example app listening at http://%s:%s", host, port)
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}