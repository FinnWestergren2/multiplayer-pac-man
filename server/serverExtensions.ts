type CustomSocketObject = { // todo: make custom protocol library with types and everything that can be shared between client and server
	message: string
}

export function handleMessage(socketObject: CustomSocketObject){
	return socketObject.message
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