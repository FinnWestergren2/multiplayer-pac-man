import { ClientMessage, MessageType, ServerMessage, MapResponse, refreshMap, CoordPair, SPEED_FACTOR, UPDATE_FREQUENCY, handlePlayerInput, ObjectStatus } from "core";
import { generateMapUsingRandomDFS } from "./mapGenerator";
import { MapStore, PlayerStore, writeToSinglePlayer, writeToAllPlayers } from ".";

const potentialDriftFactor = SPEED_FACTOR * 2 * UPDATE_FREQUENCY; // multiply by two since they could be going the opposite direction by now.
const smoothOverrideTriggerDist = 0.2;
const snapOverrideTriggerDist = 0.4;

export const handleMessage = (message: ClientMessage, fromPlayer: string) => {
	switch (message.type) {
		case MessageType.PING:
			writeToSinglePlayer({ 
				type: MessageType.PONG, 
				payload: (new Date()).getTime() - message.payload.time
			}, fromPlayer);
			return;
		case MessageType.MAP_REQUEST:
			writeToSinglePlayer({ 
				type: MessageType.MAP_RESPONSE, 
				payload: getCurrentMap() 
			}, fromPlayer);
			return;
		case MessageType.PLAYER_INPUT:
			handlePlayerInput(PlayerStore, fromPlayer, message.payload.input)
			writeToAllPlayers(message, 1, fromPlayer);
			return;
		case MessageType.CLIENT_PERCEPTION_UPDATE:
			const perceptionUpdate = getPerceptionUpdate(message.payload.locationMap, message.payload.timeStamp, fromPlayer);
			if (perceptionUpdate) {
				writeToSinglePlayer(perceptionUpdate, fromPlayer);
			}
			return;
		default:
			writeToSinglePlayer({ type: MessageType.INVALID, payload: null }, fromPlayer);
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

const getPerceptionUpdate:(locationMap: {[playerId: string]: CoordPair}, timeStamp: number, fromPlayer: string) => ServerMessage | null = (locationMap, timeStamp, fromPlayer) => {
	const potentialDrift = Math.abs(((new Date()).getTime() - timeStamp) * potentialDriftFactor);
	const snapOverrideSquared = Math.pow(snapOverrideTriggerDist + potentialDrift, 2);
	const smoothOverrideSquared = Math.pow(smoothOverrideTriggerDist + potentialDrift, 2);
	const smoothCorrectionMap: {[playerId: string]: CoordPair} = {};
	const snapMap: {[playerId: string]: ObjectStatus} = {};
	const fullMap = PlayerStore.getState().objectStatusDict;
	Object.keys(locationMap).filter(pId => !!fullMap[pId]).forEach(pId => {
		const serverPerception = fullMap[pId].location;
		const clientPerception = locationMap[pId];
		const distSquared = perceptionDifferenceSquared(serverPerception, clientPerception);
		if (distSquared > snapOverrideSquared) {
			console.log("snapping:", fromPlayer, pId);
			snapMap[pId] = fullMap[pId];
		}
		else if (distSquared > smoothOverrideSquared) {
			const correction = interpolate(serverPerception, clientPerception);
			if (clientPerception.x - correction.x > clientPerception.y - correction.y) {
				smoothCorrectionMap[pId] = { x: correction.x, y: clientPerception.y }
			}
			else {
				smoothCorrectionMap[pId] = { x: clientPerception.x, y: correction.y }
			}
		}
	});
	if (Object.keys(snapMap).length > 0 || Object.keys(smoothCorrectionMap).length > 0) {
		return { type: MessageType.STATE_CORRECTION, payload: { soft: smoothCorrectionMap, hard: snapMap } };
	}
	return null;
}

const perceptionDifferenceSquared = (serverPerception: CoordPair, clientPerception: CoordPair ) => {
	const xDiff = Math.abs(clientPerception.x - serverPerception.x);
	const yDiff = Math.abs(clientPerception.y - serverPerception.y);
	return Math.pow(xDiff, 2) + Math.pow(yDiff, 2)
}

const interpolate: (serverPerception: CoordPair, clientPerception: CoordPair) => CoordPair = (serverPerception, clientPerception) => {
	return { x: (serverPerception.x + clientPerception.x) * 0.5, y: (serverPerception.y + clientPerception.y) * 0.5 }
}