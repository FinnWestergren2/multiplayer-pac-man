import { handlePlayerInput, CoordPair, InputType, Input, ActorType, generateGuid } from "core";
import { GameStore } from "../containers/GameWrapper";
import { sendPlayerInput } from "../socket/clientExtensions";

export const moveUnit = (actorId: string, destination: CoordPair) => {
	const playerId = GameStore.getState().currentPlayer;
	const origin = GameStore.getState().actorDict[actorId]?.status.location;
	if (!origin || !playerId) return; // probably should do some error reporting or something someday
	if (!GameStore.getState().actorOwnershipDict[playerId].includes(actorId)) return;
	
	const input: Input = {
		type: InputType.MOVE_UNIT, 
		destination, 
		origin,
		actorId
	};

	const stampedInput = {
		timeAgo: 0,
		input
	};

	handlePlayerInput(GameStore, playerId!, stampedInput);
	sendPlayerInput(playerId!, stampedInput);
}

export const createUnit = (destination: CoordPair, actorType: ActorType) => {
	const playerId = GameStore.getState().currentPlayer;
	if (!playerId) return; // probably should do some error reporting or something someday

	const actorId = generateGuid();

	const input: Input = {
		type: InputType.CREATE_UNIT, 
		destination, 
		actorId,
		actorType
	};

	const stampedInput = {
		timeAgo: 0,
		input
	};

	handlePlayerInput(GameStore, playerId!, stampedInput);
	sendPlayerInput(playerId!, stampedInput);
}