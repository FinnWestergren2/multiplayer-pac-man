import { ClientMessage, MessageType, ServerMessage, MapResponse, refreshMap, addPlayerInput, CoordPair, SPEED_FACTOR, UPDATE_FREQUENCY, PlayerStatusMap } from "shared";
import { generateMapUsingRandomDFS } from "./mapGenerator";
import { MapStore, PlayerStore } from ".";

const potentialDriftFactor = SPEED_FACTOR * 2 * UPDATE_FREQUENCY; // multiply by two since they could be going the opposited direction by now.
const smoothOverrideTriggerDist = 0.15;
const snapOverrideTriggerDist = 0.25;

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
			return getPerceptionUpdate(message.payload.locationMap, message.payload.timeStamp);
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

const perceptionDifferenceSquared = (playerId: string, percievedLocation: CoordPair ) => {
	const internalLocation = PlayerStore.getState().playerStatusMap[playerId]?.location;
	if (!internalLocation) {
		return 0;
	}
	const xDiff = Math.abs(percievedLocation.x - internalLocation.x);
	const yDiff = Math.abs(percievedLocation.y - internalLocation.y);
	return Math.pow(xDiff, 2) + Math.pow(yDiff, 2)
}

const getPerceptionUpdate:(locationMap: {[playerId: string]: CoordPair}, timeStamp: number) => ServerMessage | null = (locationMap, timeStamp) => {
	const potentialDrift = Math.abs(((new Date()).getTime() - timeStamp) * potentialDriftFactor);
	const snapOverrideSquared = Math.pow(snapOverrideTriggerDist + potentialDrift, 2);
	const smoothOverrideSquared = Math.pow(smoothOverrideTriggerDist + potentialDrift, 2);
	let snapMap: PlayerStatusMap = {};
	let smoothMap: PlayerStatusMap = {};
	const fullMap = PlayerStore.getState().playerStatusMap;
	Object.keys(locationMap).forEach(pId => {
		const distSquared = perceptionDifferenceSquared(pId, locationMap[pId]);
		if(distSquared > snapOverrideSquared){
			snapMap = { ...snapMap, [pId]: fullMap[pId] }
		}
		else if(distSquared > smoothOverrideSquared){
			smoothMap = { ...smoothMap, [pId]: fullMap[pId] }
		}
	});
	if (Object.keys(snapMap).length + Object.keys(smoothMap).length > 0) {
		return { type: MessageType.STATE_CORRECTION, payload: { hard: snapMap, soft: smoothMap }};
	}
	return null;
}
