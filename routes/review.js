var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/project272";
exports.getaddreviewpage = function(req, res) {
	if (req.session.user == null) {
		ejs.renderFile('./views/signin.ejs', function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});
	} else {
		ejs.renderFile('./views/addreview.ejs', function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});
	}
};

exports.postreview = function(req, res) {
	console.log(req.body);
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('review');
		var json_responses;
		coll.save({
			trip : req.body
		}, function(err, status) {
			res.send({
				code : 200
			});
		});
	});
};

exports.getreviewsbytripid = function(req, res) {
	console.log(req.body);
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('review');
		var json_responses;
		coll.find({
			"trip.tripid" : req.body.tripid
		}).toArray(function(err, reviews) {
			res.send({
				reviews : reviews
			});
		});
	});
};