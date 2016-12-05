var ejs = require("ejs");

exports.getsession = function(req, res) {
	console.log("get session " + JSON.stringify(req.session.user));
	res.send({
		session : req.session.user,
		trip:req.session.thistripid
	});
};

exports.logout = function(req, res) {
	console.log("destroy session " + req.session.user);
	req.session.destroy();
	res.send({
		code : 200
	});

};