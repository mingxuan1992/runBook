var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/project272";

exports.getcreatetrippage = function(req, res) {
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
		ejs.renderFile('./views/createtrip.ejs', function(err, result) {
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

exports.guidecreatetrip = function(req, res) {
	console.log(req.body);
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('trip');
		var json_responses;
		coll.save({
			trip : req.body
		}, function(err, user) {
			if (user) {
				console.log(user.ops[0]._id);
				console.log("save trip success!");
				json_responses = {
					"statusCode" : 200,
					"tripid" : user.ops[0]._id
				};
				res.send(json_responses);
			} else {
				console.log("save trip returned false");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);
			}
		});
	});
};

exports.getuserseetrippage = function(req, res) {
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
		ejs.renderFile('./views/userseetrip.ejs', function(err, result) {
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

exports.gettripsbyguideemail = function(req, res) {
	console.log(req.body);
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('trip');
		var json_responses;
		coll.find({
			"trip.email" : "han@sjsu.edu"
		}).toArray(function(err, trips) {
			res.send({
				trips : trips
			});
		});
	});
};