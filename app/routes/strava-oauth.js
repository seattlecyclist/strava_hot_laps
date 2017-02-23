'use strict';

let MongoClient = require('mongodb').MongoClient

// MongoClient.connect('mongodb://localhost:27017/animals', function (err, db) {
//   if (err) throw err
//
//   db.collection('mammals').find().toArray(function (err, result) {
//     if (err) throw err
//
//     console.log(result)
//   })
// });

exports.oauth = function(req, res) {
  console.log("OAUTH CALLED");
  console.log("OAUTH CALLED code ", req.query.code);

  MongoClient.connect('mongodb://localhost:27017/hot_laps_dev', function (err, db) {
    if (err) throw err;

    let collection = db.collection('users');
    let doc1 = {'strava_oauth_code': req.query.code};

    collection.insert(doc1);

  });

  res.render('index', { title: 'oauth posted!', oauth_link: 'test'})
}