import { ClientRequest, MessageType, ServerResponse, MapResponse, refreshMap, updatePlayerStatus } from "shared";
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
		case MessageType.PLAYER_STATUS_UPDATE:
			//@ts-ignore
			MapStore.dispatch(updatePlayerStatus(message.payload.playerId, message.payload.status));
			return { type: MessageType.PLAYER_STATUS_UPDATE, payload: MapStore.getState().playerStatusMap };
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
