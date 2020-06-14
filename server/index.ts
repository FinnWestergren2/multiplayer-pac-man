import express from 'express';
import { json, urlencoded } from 'body-parser';
import { Server } from 'http';
import { generateMapUsingRandomDFS } from './utils/mapGenerator';
import helmet from 'helmet';
import { promises } from 'fs';

const app = express();
const server = new Server(app);
const port = 8080;

app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: true }));

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


//@ts-ignore
server.listen(port, (err) => {
	if (err) {
		throw err;
	}
	/* eslint-disable no-console */
	console.log('Node Endpoints working :)');
});


app.get('/test1', async (err, res) => {
	const data = await promises.readFile("./src/server/test/test1.json");
	res.status(200);
	res.send(data);
	res.end();
});

app.get('/test2', async (err, res) => {
	const data = await promises.readFile("./src/server/test/test2.json");
	res.status(200);
	res.send(data);
	res.end();
});

app.get('/generateMap', async (err, res) => {
	console.log('called generateMap');
	const data = generateMapUsingRandomDFS();
	res.status(200);
	res.send(data);
	res.end();
});

export { server };
