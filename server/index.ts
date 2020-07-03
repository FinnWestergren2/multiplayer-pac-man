import http from 'http';
import nodeStatic from 'node-static';
import crypto from 'crypto';

const file = new nodeStatic.Server('./');
const serverId = '258EAFA5-E914–47DA-95CA-C5AB0DC85B11';
const port = 8080;
const server = http.createServer((req, res) => {
	req.addListener('end', () => file.serve(req, res)).resume();
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
});
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));

const generateHash = (acceptKey: string) => crypto
	.createHash('sha1')
	// @ts-ignore
	.update(acceptKey + serverId, 'binary')
	.digest('base64');

server.on('upgrade', (req, socket) => {
	// Make sure that we only handle WebSocket upgrade requests
	if (req.headers['upgrade'] !== 'websocket') {
		socket.end('HTTP/1.1 400 Bad Request');
		return;
	}
	const acceptKey = req.headers['sec-websocket-key']; // Read the websocket key provided by the client: 
	const hash = generateHash(acceptKey); // Generate the response value to use in the response: 
	// Write the HTTP response into an array of response lines: 
	const responseHeaders = ['HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: WebSocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${hash}`];
	const protocol = req.headers['sec-websocket-protocol']; // Read the subprotocol from the client request headers:
	const protocols = !protocol ? [] : protocol.split(',').map((s: string) => s.trim());
	if (protocols.includes('json')) {
		// Tell the client that we agree to communicate with JSON data
		responseHeaders.push(`Sec-WebSocket-Protocol: json`);
	}
	// Write the response back to the client socket, being sure to append two 
	// additional newlines so that the browser recognises the end of the response 
	// header and doesn't continue to wait for more header data: 
	socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');
});

server.on('connection', () => console.log("connected"));
