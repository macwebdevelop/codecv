/* 
 * What about serving up static content, kind of like apache? 
 * This time, you are required to present a user and password to the login route
 * before you can read any static content.
 */

var process = require('process');

var port = parseInt(process.argv[2]);

var express = require('express');
var app = express();

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
const sqlite3 = require('sqlite3').verbose();

// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
// will create the db if it does not exist
var db = new sqlite3.Database('db/database.db', function (err) {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS user (userName VARCHAR(50) PRIMARY KEY NOT NULL, userPassword VARCHAR(50) NOT NULL, userEmail VARCHAR(50) NOT NULL)");
});

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('static_files')); 

app.post('/api/register/', function (req, res) {
	var userName = req.body.userName;
	var userPassword = req.body.userPassword;
	var userEmail = req.body.userEmail;
	console.log("POST:"+userName+", "+userPassword);

	let sql = 'INSERT INTO user(userName, userPassword, userEmail) VALUES (?,?,?);';
	db.run(sql, [userName, userPassword, userEmail], function (err){
		var result = {};
  		if (err) {
			res.status(409); 
    		result["error"] = err.message;
  		} else {
			result["userName"] = "updated rows: "+ userName + ", " + userPassword + ", " + userEmail;
		}
		console.log(JSON.stringify(result));
		res.json(result);
	});
});

app.post('/api/login/', function(req, res) {
	var userName = req.body.loginName;
	var userPassword = req.body.loginPassword;
	console.log("POST: "+userName);

	let sql = 'SELECT * FROM user WHERE userName=? AND userPassword=?;';
	db.all(sql, [userName, userPassword], function(err, rows) {
		var result = {};
		if(err){
			res.status(401);
			result["error"] = err.message;
		} else if(rows==""){
			res.status(401);
			result["error"] = "Invalid Account";
		} else {
			result["User"] = "User Logged In: " + userName;
		}
		console.log(JSON.stringify(result));
		res.json(result);
	});
});

app.patch('/api/update/', function(req,res){
	var userName = req.body.updateName;
	var userPassword = req.body.updatePassword;
	var formerPassword = req.body.oldPassword;
	console.log("UPDATE PASSWORD: "+userName);

	let sql = 'UPDATE user SET userPassword= ? WHERE userName = ? AND userPassword = ?;';
	db.run(sql, [userPassword, userName, formerPassword], function(err){
		var result = {};
		if(err){
			res.status(403);
			result["error"] = err.message;
		} else {
			result["userName"] = "Updated Password for: "+userName;
		}
		console.log(JSON.stringify(result));
		res.json(result);
	});
});

app.delete('/api/user/', function(req, res){
	var userName = req.body.userName;
	var userPassword = req.body.userPassword;
	var userEmail = req.body.userEmail
	console.log("DELETE: "+userName);

	let sql = 'DELETE FROM user WHERE userName = ? AND userPassword = ? AND userEmail=?;';
	db.run(sql, [userName, userPassword, userEmail], function(err){
		var result = {};
		if(err){
			res.status(409);
			result["error"] = err.message;
		} else {
			result["userName"] = "Deleted user: "+userName;
		}
		console.log(JSON.stringify(result));
		res.json(result);
	});
});

app.use('/', function(req,rest,next){
	next();
});


app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});







