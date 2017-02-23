let strava = require('strava-v3');
let link = strava.oauth.getRequestAccessURL({scope: "view_private,write"});

console.log("The strava Link", link);

exports.show = function(req, res) {
  res.render('index', { title: 'The index page via router!', oauth_link: link })
}