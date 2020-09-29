import { ClientMessage, MessageType, ServerMessage, MapResponse, refreshMap, addPlayerInput, CoordPair, SPEED_FACTOR, UPDATE_FREQUENCY } from "shared";
import { generateMapUsingRandomDFS } from "./mapGenerator";
import { MapStore, PlayerStore } from ".";

const potentialDriftFactor = SPEED_FACTOR * 2 * UPDATE_FREQUENCY; // multiply by two since they could be going the opposited direction by now.

export function handleMessage(message: ClientMessage): ServerMessage | null {
	switch (message.type) {
		case MessageType.PING:
			return { type: MessageType.PONG, payload: (new Date()).getTime() - message.payload.time };
		case MessageType.MAP_REQUEST:
			return { type: MessageType.MAP_RESPONSE, payload: getCurrentMap() };
		case MessageType.PLAYER_INPUT:
			//@ts-ignore
			PlayerStore.dispatch(addPlayerInput(message.payload.playerId, message.payload.input));
			return null;
		case MessageType.CLIENT_PERCEPTION_UPDATE:
			if (isDesynced(message.payload.locationMap, message.payload.timeStamp)){
				console.log("uh oh, someones outta line. updating state");
				return { type: MessageType.STATE_OVERRIDE, payload: PlayerStore.getState().playerStatusMap}
			}
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

const isDesynced = (locationsById: { [playerId: string]: CoordPair }, timeStamp: number) => {
	return Object.keys(locationsById).some(playerId => {
		const location = locationsById[playerId];
		const internalLocation = PlayerStore.getState().playerStatusMap[playerId]?.location;
		if (!internalLocation) {
			return false;
		}
		const potentialDrift = Math.abs(((new Date()).getTime() - timeStamp) * potentialDriftFactor); 
		const distance = Math.max(Math.abs(location.x - internalLocation.x), Math.abs(location.y - internalLocation.y));
		console.log(distance, potentialDrift);
		return distance >= (0.15 + potentialDrift);
	});
}
