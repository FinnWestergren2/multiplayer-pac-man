import { ClientRequest, MessageType, ServerResponse, MapResponse } from "shared";
import { generateMapUsingRandomDFS } from "./mapGenerator";

export function handleMessage(message: ClientRequest): ServerResponse {
	switch(message.type) {
		case MessageType.PING:
			return { type: MessageType.PONG, payload: (new Date()).getTime() - message.payload };
		case MessageType.HELLO:
			return { type: MessageType.HELLO, payload: null };
		case MessageType.MAP_REQUEST:
			return { type: MessageType.MAP_RESPONSE, payload: getCurrentMap(message.payload) }
		default:
			return { type: MessageType.INVALID, payload: null };
	}
}

const getCurrentMap: (pIds: string[]) => MapResponse = (pIds) => {
	return generateMapUsingRandomDFS(pIds);
}