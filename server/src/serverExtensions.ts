import { ClientMessage, MessageType, ServerMessage, MapResponse, refreshMap, updatePlayerStatus, addPlayerInput } from "shared";
import { generateMapUsingRandomDFS } from "./mapGenerator";
import { MapStore, PlayerStore } from ".";

export function handleMessage(message: ClientMessage): ServerMessage | null {
	switch (message.type) {
		case MessageType.PING:
			return { type: MessageType.PONG, payload: (new Date()).getTime() - message.payload };
		case MessageType.MAP_REQUEST:
			return { type: MessageType.MAP_RESPONSE, payload: getCurrentMap() };
		case MessageType.PLAYER_INPUT:
			//@ts-ignore
			PlayerStore.dispatch(addPlayerInput(message.payload.playerId, message.payload.input));
			return null;
		default:
			return { type: MessageType.INVALID, payload: null };
	}
}

export const getCurrentMap: () => MapResponse = () => {
	if (MapStore.getState().mapCells.length === 0) {
		const newMap = generateMapUsingRandomDFS();
		// @ts-ignore
		MapStore.dispatch(refreshMap(newMap));
		return newMap;
	}
	return MapStore.getState().mapCells;
};

export const getMostRecentPlayerInputs = () => {
	const playerHistory = PlayerStore.getState().playerInputHistory;
	return Object.keys(playerHistory).filter(k => PlayerStore.getState().playerList.some(p => p === k)).map(k => { 
		return { playerId: k, input: playerHistory[k][playerHistory[k].length - 1] } 
	});
};
