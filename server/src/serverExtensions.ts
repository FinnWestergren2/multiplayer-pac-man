import { ClientRequest, MessageType, ServerResponse, MapResponse, refreshMap } from "shared";
import { generateMapUsingRandomDFS } from "./mapGenerator";
import { MapStore } from ".";

export function handleMessage(message: ClientRequest): ServerResponse {
	switch (message.type) {
		case MessageType.PING:
			return { type: MessageType.PONG, payload: (new Date()).getTime() - message.payload };
		case MessageType.HELLO:
			return { type: MessageType.HELLO, payload: null };
		case MessageType.MAP_REQUEST:
			return { type: MessageType.MAP_RESPONSE, payload: getCurrentMap() };
		default:
			return { type: MessageType.INVALID, payload: null };
	}
}

const getCurrentMap: () => MapResponse = () => {
	if (MapStore.getState().mapCells.length === 0) {
		const newMap = generateMapUsingRandomDFS();
		// @ts-ignore
		MapStore.dispatch(refreshMap(newMap));
		return newMap;
	}
	return MapStore.getState().mapCells;
}
