let strava = require('strava-v3');
let link = strava.oauth.getRequestAccessURL({scope: "view_private,write"});

strava.activities.get({id: "871313660"}, function(err,payload) {
  console.log("The strava activity", payload);
});

console.log("The strava Link", link);

exports.show = function(req, res) {
  res.render('index', { title: 'The index page via router!',
                        user: req.user,
                        oauth_link: link })
}