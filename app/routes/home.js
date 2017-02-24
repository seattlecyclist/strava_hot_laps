let strava = require('strava-v3');
let MongoClient = require('mongodb').MongoClient

let link = strava.oauth.getRequestAccessURL({scope: "view_private,write"});

let mikeNormalActivityId = "871313660";
let rocketSewardActivityId = "318612156";
let randomDudeActivityId = "317698117";
let alexanderPerryActivityId = "180358383";
let chrisWilsomActivityId = "664912153";



// strava.activities.get({id: rocketSewardActivityId}, function(err,payload) {
//   console.log("The strava activity'segment_efforts", payload);
// });



console.log("The strava Link", link);

exports.show = function(req, res) {
  loadSegments();
  res.render('index', { title: 'The index page via router!',
                        user: req.user,
                        oauth_link: link })
}


function loadSegments() {
  // This gets all the segments for one hour of racing at seward park race CW Hill
  let sewardParkCWHillSegmentId = 632474;
  strava.segments.listEfforts({id: sewardParkCWHillSegmentId,
    per_page: 100,
    start_date_local: '2015-06-04T18:00:02Z',
    end_date_local: '2015-06-04T19:00:02Z'}, function(err,payload) {
    console.log("The strava segment", payload);

    payload.forEach(function(segment) {
      console.log("******");
      storeSegment(segment);
    });
  });
}

function storeSegment(segment) {
  MongoClient.connect('mongodb://localhost:27017/hot_laps_dev', function (err, db) {
    if (err) throw err;

    let collection = db.collection('segments');
    collection.insert(segment);

  });

}