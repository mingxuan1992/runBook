var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/project272";

exports.getsigninpage = function(req, res) {

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
};

exports.signin = function(req, res) {

	var signinjson = {
		"email" : req.body.email,
		"password" : req.body.password
	};
	console.log(signinjson);
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user');

		coll.findOne(signinjson, function(err, user) {
			console.log(user);
			if (user) {
				console.log("email and password are both right, sign in success!");
				req.session.user=user;
				res.send({
					code : 200
				});
			} else {
				console.log("didn't find the email and password!");
				res.send({
					code : 301
				});
			}
		});
	});

};