'use strict';

const express = require('express');
const serveStatic = require('serve-static');
const homeRoutes = require('./routes/home');
const oauthRoutes = require('./routes/strava-oauth');

const app = express();
const layout = require('express-layout');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(layout());

app.use(serveStatic('public', {'index': 'index.html'}));

app.get('/hello', function (req, res) {
  res.send('Hello World');
});

app.get('/test', homeRoutes.show);
app.get('/strava_auth', oauthRoutes.oauth);

const server = app.listen(3000, function () {
  const host = server.address().address
  const port = server.address().port

  console.log("!!!Example app listening at http://%s:%s", host, port)
});