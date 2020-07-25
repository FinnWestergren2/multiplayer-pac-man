"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _http = _interopRequireDefault(require("http"));

var _nodeStatic = _interopRequireDefault(require("node-static"));

var _crypto = _interopRequireDefault(require("crypto"));

var _serverExtensions = require("./serverExtensions");

var file = new _nodeStatic.default.Server('./');
var serverId = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
var port = 8080;

var server = _http.default.createServer(function (req, res) {
  req.addListener('end', function () {
    return file.serve(req, res);
  }).resume();
});

server.listen(port, function () {
  return console.log("Server running at http://localhost:".concat(port));
});

var generateHash = function generateHash(acceptKey) {
  return _crypto.default.createHash('sha1').update(acceptKey + serverId).digest('base64');
};

server.on('upgrade', function (req, socket) {
  // Make sure that we only handle WebSocket upgrade requests
  if (req.headers['upgrade'] !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request');
    return;
  }

  var acceptKey = req.headers['sec-websocket-key']; // Read the websocket key provided by the client: 

  var hash = generateHash(acceptKey); // Generate the response value to use in the response: 
  // Write the HTTP response into an array of response lines: 

  var responseHeaders = ['HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: WebSocket', 'Connection: Upgrade', "Sec-WebSocket-Accept: ".concat(hash)];
  var protocol = req.headers['sec-websocket-protocol']; // Read the subprotocol from the client request headers:

  var protocols = !protocol ? [] : protocol.split(',').map(function (s) {
    return s.trim();
  });

  if (protocols.includes('json')) {
    // Tell the client that we agree to communicate with JSON data
    responseHeaders.push("Sec-WebSocket-Protocol: json");
  } // Write the response back to the client socket, being sure to append two 
  // additional newlines so that the browser recognises the end of the response 
  // header and doesn't continue to wait for more header data: 


  socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');
  socket.on('data', function (buffer) {
    return handleData(socket, buffer);
  });
});
server.on('connection', function () {
  return console.log("connected");
});
server.on('close', function () {
  return console.log("closed");
});

function handleData(socket, buffer) {
  var parsedBuffer = parseBuffer(buffer);

  if (parsedBuffer) {
    console.log(parsedBuffer);
    socket.write(constructReply((0, _serverExtensions.handleMessage)(parsedBuffer)));
  } else if (parsedBuffer === null) {
    console.log('WebSocket connection closed by the client.');
  }
}

function parseBuffer(buffer) {
  var firstByte = buffer.readUInt8(0);
  var isFinalFrame = Boolean(firstByte >>> 7 & 1); // keeping this here in case we need to persist data between frames (shouldn't need to as far as I know)
  // we can generally ignore reserve bits

  var _ref = [Boolean(firstByte >>> 6 & 1), Boolean(firstByte >>> 5 & 1), Boolean(firstByte >>> 4 & 1)],
      reserved1 = _ref[0],
      reserved2 = _ref[1],
      reserved3 = _ref[2];
  var opCode = firstByte & 15; // This is a connection termination frame 

  if (opCode === 8) {
    return null;
  } // We only care about text frames from this point onward 


  if (opCode !== 1) {
    return undefined;
  }

  var secondByte = buffer.readUInt8(1);
  var isMasked = Boolean(secondByte >>> 7 & 1); // Keep track of our current position as we advance through the buffer 

  var currentOffset = 2;
  var payloadLength = secondByte & 127;

  if (payloadLength > 125) {
    if (payloadLength === 126) {
      payloadLength = buffer.readUInt16BE(currentOffset);
      currentOffset += 2;
    } else {
      throw new Error('Large payloads not currently implemented');
    }
  } // Allocate somewhere to store the final message data
  // Only unmask the data if the masking bit was set to 1


  var data = Buffer.alloc(payloadLength);
  var maskingKey;

  if (isMasked) {
    maskingKey = buffer.readUInt32BE(currentOffset);
    currentOffset += 4; // Loop through the source buffer one byte at a time, keeping track of which
    // byte in the masking key to use in the next XOR calculation

    for (var i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
      // Extract the correct byte mask from the masking key
      var shift = j === 3 ? 0 : 3 - j << 3;
      var mask = (shift == 0 ? maskingKey : maskingKey >>> shift) & 0xFF; // Read a byte from the source buffer 

      var source = buffer.readUInt8(currentOffset++); // XOR the source byte and write the result to the data 

      data.writeUInt8(mask ^ source, i);
    }
  } else {
    buffer.copy(data, 0, currentOffset++);
  }

  return JSON.parse(data.toString('utf8'));
}

function constructReply(message) {
  // Convert the data to JSON and copy it into a buffer
  var json = JSON.stringify(message);
  var jsonByteLength = Buffer.byteLength(json); // Note: we're not supporting > 65535 byte payloads at this stage 

  var lengthByteCount = jsonByteLength < 126 ? 0 : 2;
  var payloadLength = lengthByteCount === 0 ? jsonByteLength : 126;
  var buffer = Buffer.alloc(2 + lengthByteCount + jsonByteLength); // Write out the first byte, using opcode `1` to indicate that the message 
  // payload contains text data 

  buffer.writeUInt8(129, 0);
  buffer.writeUInt8(payloadLength, 1); // Write the length of the JSON payload to the second byte 

  var payloadOffset = 2;

  if (lengthByteCount > 0) {
    buffer.writeUInt16BE(jsonByteLength, 2);
    payloadOffset += lengthByteCount;
  } // Write the JSON data to the data buffer 


  buffer.write(json, payloadOffset);
  return buffer;
}

;