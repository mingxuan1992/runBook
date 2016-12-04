var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/project272";

exports.getsignuppage = function(req, res) {

	ejs.renderFile('./views/signup.ejs', function(err, result) {
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

exports.signup = function(req, res) {

	// check user already exists
	// var getUser="select * from users where
	// emailid='"+req.param("username")+"'";

	var signupjson = {
		"firstname" : req.body.firstname,
		"lastname" : req.body.lastname,
		"email" : req.body.email,
		"password" : req.body.password
	};
	req.session.signupjson = signupjson;

	res.send({
		status : "success"
	});

};

exports.getsignupwithrolepage = function(req, res) {
	if (req.session.signupjson === null) {

		ejs.renderFile('./views/signup.ejs', function(err, result) {
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
		console
				.log("turn to chooserole page, have found signupjson in session");
		ejs.renderFile('./views/signupwithrole.ejs', function(err, result) {
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

exports.signupwithrole = function(req, res) {

	var signupjson = {
		"firstname" : req.session.signupjson.firstname,
		"lastname" : req.session.signupjson.lastname,
		"email" : req.session.signupjson.email,
		"password" : req.session.signupjson.password,
		"role" : req.body.role
	};

	req.session.signupjson = signupjson;
	// check email available
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user');

		coll.findOne({
			email : req.session.signupjson.email
		}, function(err, user) {
			if (user) {
				console.log("email not available!");
				res.send({
					code : 301
				});
			} else {
				dosignuptomongo(signupjson, req, res);
			}
		});
	});

};

function dosignuptomongo(json, req, res) {
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user');

		coll.save(json, function(err, user) {
			if (user) {
				console.log("signup success!");
				res.send({
					code : 200
				});
			} else {
				console.log("returned false");
				res.send({
					code : 400
				});
			}
		});
	});

}