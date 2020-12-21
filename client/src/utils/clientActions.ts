import { handlePlayerInput, CoordPair, InputType } from "core";
import { PlayerStore } from "../containers/GameWrapper";
import { sendPlayerInput } from "../socket/clientExtensions";

export const playerPathInput = (playerId: string, destination: CoordPair) => {
	const stampedInput = { time: (new Date()).getTime(), input: { type: InputType.PLAYER_PATH_INPUT, destination, currentLocation: PlayerStore.getState().playerStatusMap[playerId].location } };
	handlePlayerInput(PlayerStore, playerId, stampedInput);
	sendPlayerInput(playerId, stampedInput);
}