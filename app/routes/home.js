'use strict';

let strava = require('strava-v3');
let MongoClient = require('mongodb').MongoClient

let link = strava.oauth.getRequestAccessURL({scope: "view_private,write"});

let mikeNormalActivityId = "871313660";
let rocketSewardActivityId = "318612156";
let randomDudeActivityId = "317698117";
let alexanderPerryActivityId = "180358383";
let chrisWilsomActivityId = "664912153";

exports.load = function(req, res) {
  loadSegments(req, res);
  res.render('index', { title: 'The index page via router!',
                        user: req.user,
                        oauth_link: link })
};

exports.average = function(req, res) {
  segmentAverage(res);
};

function loadSegments(req, res) {
  // This gets all the segments for one hour of racing at seward park race CW Hill
  let sewardParkCWHillSegmentId = 632474;
  strava.segments.listEfforts({id: sewardParkCWHillSegmentId,
    per_page: 100,
    start_date_local: '2015-06-04T18:00:02Z',
    end_date_local: '2015-06-04T19:00:02Z'}, function(err,payload) {

    payload.forEach(function(segment) {
      storeSegment(segment, req, res);
    });
  });
}

function storeSegment(segment, req, res) {
  let collection = req.app.locals.db.collection('segments');

  collection.findOne({id: segment.id}, function(err, existing) {
    if (existing === null) {
      console.log("inserting");
      collection.insert(segment);
    }
  });
};

function segmentAverage(res) {
    let collection = res.app.locals.db.collection('segments');
    collection.aggregate([
      { $group: { _id: "$segment.id", average: { $avg: "$elapsed_time" } } }
    ], function(err, results) {
      console.log("Showing Average", results);
      res.send('The Segment Average = ' + results[0].average);
    });
};