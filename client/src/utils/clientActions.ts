import { handlePlayerInput, CoordPair, InputType } from "shared";
import { PlayerStore } from "../containers/GameWrapper";
import { sendPlayerInput } from "../socket/clientExtensions";

export const playerPathInput = (playerId: string, destination: CoordPair) => {
	const stampedInput = {frame: (new Date).getTime(), input: { type: InputType.PLAYER_PATH_INPUT, destination } };
	handlePlayerInput(PlayerStore, playerId, stampedInput);
	sendPlayerInput(playerId, stampedInput);
}