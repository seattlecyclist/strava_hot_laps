'use strict';

const express = require('express');
const serveStatic = require('serve-static');
let strava = require('strava-v3');

let link = strava.oauth.getRequestAccessURL({scope: "view_private,write"});
console.log("The strava Link", link);

const app = express();
const layout = require('express-layout');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(layout());

app.use(serveStatic('public', {'index': 'index.html'}));

app.get('/hello', function (req, res) {
  res.send('Hello World');
});

app.get('/ejs_test', function(req, res) {
  res.render('index', { title: 'The index page!', oauth_link: link })
});

const server = app.listen(3000, function () {
  const host = server.address().address
  const port = server.address().port

  console.log("!!!Example app listening at http://%s:%s", host, port)
});