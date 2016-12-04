var ejs = require("ejs");

exports.getaboutpage = function(req, res) {

	ejs.renderFile('./views/about.ejs', function(err, result) {
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