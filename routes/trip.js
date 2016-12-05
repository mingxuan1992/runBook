var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/project272";
var ObjectId = require('mongodb').ObjectId;
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

exports.gettripposterpage = function(req, res) {
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
		if (req.session.thistripid == null) {
			// todo
			console.log("thistripid is null");
		} else {
			ejs.renderFile('./views/tripposter.ejs', function(err, result) {
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
	}
};

exports.setthistripid = function(req, res) {

	req.session.thistripid = req.body.thistripid;
	console.log(req.session.thistripid);
	res.send({
		code : 200
	});
};

exports.gettripsbyguideemail = function(req, res) {
	console.log(req.body);
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('trip');
		var json_responses;
		coll.find({
			"trip.email" : req.body.email
		}).toArray(function(err, trips) {
			res.send({
				trips : trips
			});
		});
	});
};

exports.gettripsbytripid = function(req, res) {
	console.log(req.body);
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('trip');
		var json_responses;
		coll.find({
			_id : new ObjectId(req.body.tripid)
		}).toArray(function(err, trips) {
			res.send({
				trips : trips
			});
		});
	});
};
exports.gettripemailbytripid = function(req, res) {
	console.log(req.body);
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('trip');
		var json_responses;
		coll.find({
			_id : new ObjectId(req.body.tripid)
		}).toArray(function(err, trips) {
			res.send({
				tripemail : trips[0].trip.email
			});
		});
	});
};

exports.getalltrips = function(req, res) {
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('trip');
		var json_responses;
		coll.find({}).toArray(function(err, trips) {
			res.send({
				trips : trips
			});
		});
	});
};

exports.likethistrip = function(req, res) {
	console.log(req.body.tripemail);
	console.log(req.body.useremail);
	console.log(req.body.tripid);
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('like');
		var json_responses;
		coll.save({
			tripemail : req.body.tripemail,
			useremail : req.body.useremail,
			tripid : req.body.tripid
		}, function(err, likes) {
			res.send({
				code : 200
			});
		});
	});
};

function gettripbyid(id) {
	var thistrip;
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('trip');
		var json_responses;
		coll.findOne({
			_id : new ObjectId(id)
		}, function(err, trip) {
			thistrip = trip;
			console.log(trip);
		});
	});
	return thistrip;
}

exports.getalllikesbyuseremail = function(req, res) {

	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('like');
		var json_responses;
		coll.find({
			useremail : req.body.email
		}).toArray(function(err, likes) {
			var tripsidarray = new Array(likes.length);
			var i;
			for (i = 0; i < likes.length; i++) {
				tripsidarray[i] = new ObjectId(likes[i].tripid);
			}
			console.log(tripsidarray);
			mongo.connect(mongoURL, function() {
				console.log('Connected to mongo at: ' + mongoURL);
				var coll = mongo.collection('trip');
				var json_responses;
				coll.find({
					_id : {
						"$in" : tripsidarray
					}
				}).toArray(function(err, tripsdata) {
					res.send({
						trips : tripsdata
					});
					console.log("ok");
					console.log(tripsdata);
				});
			});

		});
	});
};
exports.getlikesbytripid = function(req, res) {
	
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('like');
		var json_responses;
		coll.find({
			tripid:req.body.tripid
		}).toArray(function(err, likes) {
			console.log(likes);
			res.send({
				likes:likes
			});
		});
	});
};

exports.getguestseetripspage = function(req, res) {
	
		ejs.renderFile('./views/guestseetrips.ejs', function(err, result) {
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

};