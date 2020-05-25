const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = 8080;
const helmet = require('helmet');
const fs = require('fs');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});

//pre-flight requests
app.options('*', function(req, res) {
	res.send(200);
});

server.listen(port, (err) => {
	if (err) {
		throw err;
	}
	/* eslint-disable no-console */
	console.log('Node Endpoints working :)');
});


app.get('/test1', async (err, res) => {
	const data = await fs.promises.readFile("./src/test/test1.json");
	res.status(200);
	res.send(data);
	res.end();
});

app.get('/test2', async (err, res) => {
	const data = await fs.promises.readFile("./src/test/test2.json");
	res.status(200);
	res.send(data);
	res.end();
});

module.exports = server;