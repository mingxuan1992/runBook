var fs = require('fs');
var mongoURL = "mongodb://localhost:27017/project272";
var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectId;
var ejs = require("ejs");
var request = require('request').defaults({
	encoding : null
});



function savebufferimagetomongo(image,req,res){
	
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('image');
		var json_responses;
		coll.save({
			image : image
		}, function(err, user) {
			if (user) {
				console.log(user.ops[0]._id);
				console.log("save image success!");
				json_responses = {
					"statusCode" : 200,
					"imageid" : user.ops[0]._id
				};
				res.send(json_responses);
			} else {
				console.log("save location returned false");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);
			}
		});
	});	
}


exports.uploadimage = function(req, res) {

	var temppath = req.files.myimage.path;
	var image = {};

	image.data = fs.readFileSync(temppath);
	image.contentType = 'image/png';

	savebufferimagetomongo(image,req,res);


};

exports.uploadimagewhensearch = function(req, res) {

	
	request.get(req.body.imageurl, function(err, response, body) {
		var image = {};
		image.data = body;
		image.contentType = 'image/png';
		savebufferimagetomongo(image,req,res);

	});

};




exports.getimagebyid = function(req, res) {
	var imageid = req.body.imageid;
	console.log(req.body.imageid);

	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('image');
		var json_responses;
		coll.findOne({
			_id : new ObjectId(imageid)
		}, function(err, doc) {
			if (doc) {
				console.log(doc._id);
				console.log("find image success!");
				json_responses = {
					image : doc.image.data
				};
				res.send(json_responses);
			} else {
				console.log("find returned false");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);
			}
		});
	});

};