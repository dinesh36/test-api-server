let sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database(':memory:'),
	express =  require('express'),
	app = express(),
	port = process.env.PORT || 9100,
	Response = require('./response'),
	response = new Response(),
	bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(response.handler());
require('./models/users')(app,db);
console.log(`server is running on ${port} port`);
app.listen((port));