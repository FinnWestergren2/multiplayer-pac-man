import { handlePlayerInput, CoordPair, InputType, ActorType } from "core";
import { GameStore } from "../containers/GameWrapper";
import { sendPlayerInput } from "../socket/clientExtensions";

export const champPathInput = (playerId: string, destination: CoordPair) => {
	const actorId = GameStore.getState().actorOwnershipDict[playerId]?.find(actId => {
		return GameStore.getState().actorDict[actId].type === ActorType.CHAMPION;
	});
	if (!actorId) return;
	const stampedInput = { 
		timeAgo: 0, 
		input: { 
			type: InputType.MOVE_UNIT, 
			destination, 
			origin: GameStore.getState().actorDict[actorId].status.location,
			actorId
		} };
	handlePlayerInput(GameStore, playerId, stampedInput);
	sendPlayerInput(playerId, stampedInput);
}