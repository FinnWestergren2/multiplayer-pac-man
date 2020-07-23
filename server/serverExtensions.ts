export function handleData(socket: any, buffer: Buffer) {
	const message = parseMessage(buffer);
	if (message) {
		// For our convenience, so we can see what the client sent
		console.log(message);
		// We'll just send a hardcoded message in this example 
		socket.write(constructReply({ message: 'Hello from the socket!' }));
	} else if (message === null) {
		console.log('WebSocket connection closed by the client.');
	}
}

function constructReply(data: { message: string }) {
	// Convert the data to JSON and copy it into a buffer
	const json = JSON.stringify(data)
	const jsonByteLength = Buffer.byteLength(json);
	// Note: we're not supporting > 65535 byte payloads at this stage 
	const lengthByteCount = jsonByteLength < 126 ? 0 : 2;
	const payloadLength = lengthByteCount === 0 ? jsonByteLength : 126;
	const buffer = Buffer.alloc(2 + lengthByteCount + jsonByteLength);
	// Write out the first byte, using opcode `1` to indicate that the message 
	// payload contains text data 
	buffer.writeUInt8(0b10000001, 0);
	buffer.writeUInt8(payloadLength, 1);
	// Write the length of the JSON payload to the second byte 
	let payloadOffset = 2;
	if (lengthByteCount > 0) {
		buffer.writeUInt16BE(jsonByteLength, 2); payloadOffset += lengthByteCount;
	}
	// Write the JSON data to the data buffer 
	buffer.write(json, payloadOffset);
	return buffer;
};

function parseMessage(buffer: any) {
	const firstByte = buffer.readUInt8(0);
	const isFinalFrame = Boolean((firstByte >>> 7) & 1);
	// we can generally ignore reserve bits
	const [reserved1, reserved2, reserved3] = [Boolean((firstByte >>> 6) & 1), Boolean((firstByte >>> 5) & 1), Boolean((firstByte >>> 4) & 1)];
	const opCode = firstByte & 15;
	// We can return null to signify that this is a connection termination frame 
	if (opCode === 8) {
		return null;
	}
	// We only care about text frames from this point onward 
	if (opCode !== 1) {
		return null;
	}
	const secondByte = buffer.readUInt8(1);
	const isMasked = Boolean((secondByte >>> 7) & 1);
	// Keep track of our current position as we advance through the buffer 
	let currentOffset = 2; let payloadLength = secondByte & 127;
	if (payloadLength > 125) {
		if (payloadLength === 126) {
			payloadLength = buffer.readUInt16BE(currentOffset);
			currentOffset += 2;
		} else {
			// 127 
			// If this has a value, the frame size is ridiculously huge! 
			const leftPart = buffer.readUInt32BE(currentOffset);
			const rightPart = buffer.readUInt32BE(currentOffset += 4);
			// Honestly, if the frame length requires 64 bits, you're probably doing it wrong. 
			// In Node.js you'll require the BigInt type, or a special library to handle this. 
			throw new Error('Large payloads not currently implemented');
		}
	}

	// Allocate somewhere to store the final message data
	// Only unmask the data if the masking bit was set to 1
	const data = Buffer.alloc(payloadLength);

	let maskingKey: number;
	if (isMasked) {
		maskingKey = buffer.readUInt32BE(currentOffset);
		currentOffset += 4;
		// Loop through the source buffer one byte at a time, keeping track of which
		// byte in the masking key to use in the next XOR calculation
		for (let i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
			// Extract the correct byte mask from the masking key
			const shift = j = 3 ? 0 : (3 - j) << 3;
			const mask = (shift == 0 ? maskingKey : (maskingKey >>> shift)) & 0xFF;
			// Read a byte from the source buffer 
			const source = buffer.readUInt8(currentOffset++);
			// XOR the source byte and write the result to the data 
			buffer.data.writeUInt8(mask ^ source, i);
		}
	} else {
		// Not masked - we can just read the data as-is
		buffer.copy(data, 0, currentOffset++);
	}
}