var process = require('process');

var port = parseInt(process.argv[2]);
var portal = port + 1;

var express = require('express');
const fs = require('fs');
const WebSocketServer = require('ws');
const wss = new WebSocketServer.Server({port: portal});

var app = express();

const sqlite3 = require('sqlite3').verbose();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db = new sqlite3.Database('db/database.db', function (err) {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});

db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS balance (id INTEGER PRIMARY KEY AUTOINCREMENT, amount DECIMAL(12, 2) NOT NULL, text VARCHAR(100) NOT NULL);");
});


app.use(express.static('static_files'));

app.get('/api/getTransactions/', function(req, res){
	var transactions = [];
  console.log("GET: Transactions");

  let sql = 'SELECT * FROM balance;';
  db.all(sql, [], function(err, rows){
		var result = {};
    if(err){
      res.status(404);
      result["error"] = err.message;
			res.json(result);
			console.log(JSON.stringify(result));
    } else {
      rows.forEach((row) => {
				transactions.push(row);
      });
			res.json(transactions);
      console.log(JSON.stringify(transactions));
    }
  });
});

app.get('/api/getBalance/', function(req, res){
  console.log("GET: Balance");

  let sql = 'SELECT ROUND(TOTAL(amount), 2) FROM balance;';
  db.get(sql, [], function(err, row){
    var result = {};
    if(err){
      res.status(400);
      result["error"] = err.message;
    } else {
      result["balance"] = row;
    }
    console.log(JSON.stringify(result));
    res.json(result);
  });
});

app.get('/api/getIncome/', function(req, res){
  console.log("GET: Income");

  let sql = 'SELECT ROUND(TOTAL(amount), 2) FROM balance WHERE amount > 0;';
  db.get(sql, [], function(err, row){
    var result = {};
    if(err){
      res.status(400);
      result["error"] = err.message;
    } else {
      result["income"] = row;
    }
    console.log(JSON.stringify(result));
    res.json(result);
  });
});

app.get('/api/getExpenses/', function(req, res){
  console.log("GET: Expenses");

  let sql = 'SELECT ROUND(TOTAL(amount), 2) FROM balance WHERE amount < 0;';
  db.get(sql, [], function(err, row){
    var result = {};
    if(err){
      res.status(400);
      result["error"] = err.message;
    } else {
      result["expense"] = row;
    }
    console.log(JSON.stringify(result));
    res.json(result);
  });
});

app.post('/api/addTransaction/', function(req, res){
  var text = req.body.text;
  var amount = req.body.amount;
  console.log("POST: "+text+" - "+amount);

  let sql = 'INSERT INTO balance (text, amount) VALUES (?, ?);';
  db.run(sql, [text, amount], function(err){
    var result = {};
    if(err){
      res.status(400);
      result["error"] = err.message;
    } else {
      result["response"] = "Insert Successful: "+text;
    }
    console.log(JSON.stringify(result));
    res.json(result);
  });
});

app.put('/api/updateTransaction/', function(req, res){
	var id = req.body.id;
  var updateText = req.body.text;
  var updateAmount = req.body.amount;
  console.log("UPDATE: Transaction "+id);

  let sql = 'UPDATE balance SET text = ?, amount = ? WHERE id = ?;';
  db.run(sql, [updateText, updateAmount, id], function(err){
    var result = {};
    if(err){
      res.status(400);
      result["error"] = err.message;
    } else {
      result["response"] = "Update Successful: "+id;
    }
    console.log(JSON.stringify(result));
    res.json(result);
  });
});

app.delete('/api/deleteTransaction/', function(req, res){
  var id = req.body.id;
  console.log("DELETE: Transaction ID - "+id);

  let sql = 'DELETE FROM balance WHERE id = ?;';
  db.run(sql, [id], function(err){
    var result = {};
    if(err){
      res.status(409);
      result["error"] = err.message;
    } else {
      result["transactionDeleted"] = "Deleted Transaction: "+id;
    }
    console.log(JSON.stringify(result));
    res.json(result);
  });
});

app.delete('/api/deleteAll/', function(req, res){
	console.log("DELETE: All Transactions");

	let sql = 'DELETE FROM balance;';
	db.run(sql, [], function(err){
		var result = {};
		if(err){
			res.status(400);
			result["error"] = err.message;
		} else {
			result["deleteAll"] = "Deleted all transactions";
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
