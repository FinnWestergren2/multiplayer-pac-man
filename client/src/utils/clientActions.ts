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
			type: InputType.PLAYER_PATH_INPUT, 
			destination, 
			currentLocation: GameStore.getState().actorDict[actorId].status.location 
		} };
	handlePlayerInput(GameStore, playerId, stampedInput);
	sendPlayerInput(playerId, stampedInput);
}