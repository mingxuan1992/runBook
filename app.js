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
// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
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



http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
