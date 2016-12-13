var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

var session = require('client-sessions');
app.use(session({

	cookieName : 'session',
	secret : 'cmpe272',
	duration : 30 * 60 * 1000, // setting the time for active session
	activeDuration : 5 * 60 * 1000,
}));

var mongoSessionConnectURL = "mongodb://localhost:27017/project272";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");
// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressSession({
	secret: 'cmpe272_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes');
app.get('/', routes.index);

var signup = require('./routes/signup');
app.get('/signup', signup.getsignuppage);
app.post('/signup', signup.signup);
app.get('/signupwithrole', signup.getsignupwithrolepage);
app.post('/signupwithrole', signup.signupwithrole);

var signin = require('./routes/signin');
app.get('/signin', signin.getsigninpage);
app.post('/signin', signin.signin);

var about = require('./routes/about');
app.get('/about', about.getaboutpage);

var trip = require('./routes/trip');
app.get('/createtrip', trip.getcreatetrippage);
app.post('/guidecreatetrip',trip.guidecreatetrip);
app.get('/userseetrip', trip.getuserseetrippage);
app.post('/gettripsbyguideemail',trip.gettripsbyguideemail);

app.get('/tripposter',trip.gettripposterpage);
app.post('/setthistripid',trip.setthistripid);
app.post('/gettripsbytripid',trip.gettripsbytripid);
app.post('/getalltrips',trip.getalltrips);
app.post('/gettripemailbytripid',trip.gettripemailbytripid);

app.post('/likethistrip',trip.likethistrip);
app.post('/getalllikesbyuseremail',trip.getalllikesbyuseremail);
app.post('/getlikesbytripid',trip.getlikesbytripid);

app.get('/guestseetrips',trip.getguestseetripspage);

var session = require('./routes/session');
app.get('/getsession', session.getsession);
app.get('/logout', session.logout);

var image = require('./routes/image');
app.post('/uploadimage',image.uploadimage);
app.post('/uploadimagewhensearch',image.uploadimagewhensearch);
app.post('/getimagebyid',image.getimagebyid);

var userhome = require('./routes/userhome');
app.get('/userhome',userhome.getuserhomepage);

var review=require('./routes/review');
app.get('/addreview',review.getaddreviewpage);
app.post('/postreview',review.postreview);
app.post('/getreviewsbytripid',review.getreviewsbytripid);

mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});

