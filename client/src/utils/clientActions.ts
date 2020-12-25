import { handlePlayerInput, CoordPair, InputType } from "core";
import { GameStore } from "../containers/GameWrapper";
import { sendPlayerInput } from "../socket/clientExtensions";

export const playerPathInput = (playerId: string, destination: CoordPair) => {
	const stampedInput = { time: (new Date()).getTime(), input: { type: InputType.PLAYER_PATH_INPUT, destination, currentLocation: GameStore.getState().objectStatusDict[playerId].location } };
	handlePlayerInput(GameStore, playerId, stampedInput);
	sendPlayerInput(playerId, stampedInput);
}