const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const passport = require('passport');

const app = express();

const http = require('http');
const https = require('https');

// CORS configuration
const corsOptions = 
{
	origin: 'https://localhost', // Allow only your frontend domain
	credentials: true, // Allow cookies and other credentials
	optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded());//{ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase');
const db = mongoose.connection;
db.once('open', () => {
	console.log('Connected to MongoDB');
});

// Import the User model
const User = require('./models/User');

// Session store configuration
const store = MongoStore.create({
	mongoUrl: 'mongodb://localhost:27017/mydatabase',
	dbName: 'mydatabase',
	collectionName: 'sessions'
});

// Session middleware configuration
app.use(session({
	secret: 'mysecretkey',
	resave: false,
	saveUninitialized: false,
	store: store,
	cookie: { secure: true, maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Passport Config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());



app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.use('/pictures', express.static(path.join(__dirname, 'pictures')));

app.use('/audios', express.static(path.join(__dirname, 'audios')));


// Import and use routes
const registerRoute = require('./routes/register');
app.use(registerRoute);

const loginRoute = require('./routes/login');
app.use(loginRoute);

const adminRoutes = require('./routes/admin');
app.use(adminRoutes);

const chatRoutes = require('./routes/messages');
app.use(chatRoutes);

const connectionRoutes = require('./routes/connections');
app.use(connectionRoutes);

const postRoute = require('./routes/post');
app.use(postRoute.app);

const commentRoute = require('./routes/comment');
app.use(commentRoute);

const matrix_factorizationRoute = require('./routes/matrix_factorization');
app.use(matrix_factorizationRoute.app);

const matrix = require('./routes/matrix');
app.use(matrix);

var schedule = require('node-schedule');
// the matrix_factorization will be executed/calculated automatically every hour at 25 minutes past the hour
var j = schedule.scheduleJob('25 * * * *', function(){  // this for one hour
 	matrix_factorizationRoute.matrix_factorization();
});

// Link for the below code but I modifying some things
// https://stackoverflow.com/questions/70486799/search-by-multiple-fields-in-mongodb
app.get('/api/search', async (req, res) => {
	console.log("search");
	const query = req.query.q;
	const regex = new RegExp(query, 'i'); // case-insensitive regex

	try {
		const users = await User.find({
			$or: [
				{ first_name: regex },
				{ last_name: regex },
				{ $expr: { $regexMatch: { input: { $concat: ['$first_name', ' ', '$last_name'] }, regex: query, options: 'i' } } },
				{ $expr: { $regexMatch: { input: { $concat: ['$last_name', ' ', '$first_name'] }, regex: query, options: 'i' } } }
			]
		});
		res.json({ users });
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Serve static files from the pics directory
app.use('/pics', express.static(path.join(__dirname, 'pics')));

//------------------------------------------------------------------------------------//
// For creating dummy friendships
const { createFriendshipdummy, findFriends } = require('./routes/friends_dummy');

// // user coder1 friends with architect1 and designer1
// const user_coder1_id = '66e00cdb7688562088600d76';
// const user_architect1_id = '66e010a47688562088600d94';
// const user_designer1_id = '66e0125f7688562088600dd0';
// createFriendshipdummy(user_coder1_id, user_architect1_id);
// createFriendshipdummy(user_coder1_id, user_designer1_id);

// // user coder2 friends with scientist1 and teacher1
// const user_coder2_id = '66e010507688562088600d88';
// const user_scientist1_id = '66e011e87688562088600db8';
// const user_teacher1_id = '66e0121d7688562088600dc4';
// createFriendshipdummy(user_coder2_id, user_scientist1_id);
// createFriendshipdummy(user_coder2_id, user_teacher1_id);

// // user architect2 friend with designer2
// const user_architect2_id = '66e011317688562088600da0';
// const user_designer2_id = '66e0129e7688562088600ddc';
// createFriendshipdummy(user_architect2_id, user_designer2_id);

// user coder3 friend with coder4
// const user_coder3_id = '66eaac27a67169ac8fc50884';
// const user_coder4_id = '66eaac88a67169ac8fc508b3';
// createFriendshipdummy(user_coder3_id, user_coder4_id);
//------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------//
// For HTTPS with protocol SSL 
const sslOptions = {
	key: fs.readFileSync(path.resolve(__dirname, 'private.key')),
	cert: fs.readFileSync(path.resolve(__dirname, 'certificate.crt')),
};
  
const httpsServer = https.createServer(sslOptions, app);
  
const PORT = 8443;
httpsServer.listen(PORT, () => {
	console.log(`HTTPS Server running on port ${PORT}`);
});
//------------------------------------------------------------------------------------//
// Create an HTTP server to redirect to HTTPS
const httpApp = express();
httpApp.get('*', (req, res) => {
	console.log("get");
  res.redirect(`https://${req.hostname}:${PORT}${req.url}`);
});

const HTTP_PORT = 80; // Using a port above 1024 for development
const httpServer = http.createServer(httpApp);
httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP Server running on port ${HTTP_PORT} and redirecting to HTTPS`);
});