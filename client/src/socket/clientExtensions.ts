import { MessageType, ServerMessage, ClientMessage, Directions, setCurrentPlayers, addPlayer, removePlayer, handlePlayerInput, handleStateCorrection, setPlayerStatus, StampedInput } from "shared";
import { MapStore, ClientSocket, PlayerStore } from "../containers/GameWrapper";
import { refreshMap } from "shared";

export function handleMessage(message: ServerMessage): void {
    switch (message.type) {
        case MessageType.PONG:
            return;
        case MessageType.INIT_PLAYER:
            // @ts-ignore
            PlayerStore.dispatch(setCurrentPlayers(message.payload.currentPlayerId, message.payload.fullPlayerList));
            // @ts-ignore
            PlayerStore.dispatch(setPlayerStatus(message.payload.playerStatusMap));
            return;
        case MessageType.MAP_RESPONSE:
            // @ts-ignore
            MapStore.dispatch(refreshMap(message.payload));
            return;
        case MessageType.ADD_PLAYER:
            // @ts-ignore
            PlayerStore.dispatch(addPlayer(message.payload));
            return;
        case MessageType.REMOVE_PLAYER:
            // @ts-ignore
            PlayerStore.dispatch(removePlayer(message.payload));
            return;
        case MessageType.PLAYER_INPUT:
            handlePlayerInput(PlayerStore, message.payload.playerId, message.payload.input);
            return;
        case MessageType.INVALID:
            console.error('sent an invalid message to server')
            return;
        case MessageType.STATE_OVERRIDE:
            // @ts-ignore
            PlayerStore.dispatch(setPlayerStatus(message.payload));
            return;
        case MessageType.STATE_CORRECTION:
            handleStateCorrection(PlayerStore, message.payload);
            return
        default:
            console.error('recieved an invalid message type from server')
            return;
    }
}

export const pingServer = () => {
    const request: ClientMessage = { type: MessageType.PING, payload: { time: (new Date()).getTime(), playerId: PlayerStore.getState().currentPlayer! } }
    ClientSocket.send(JSON.stringify(request));
}

export const requestMap = () => {
    const request: ClientMessage = { type: MessageType.MAP_REQUEST, payload: null }
    ClientSocket.send(JSON.stringify(request));
}

export const sendPlayerInput = (playerId: string, input: StampedInput) => {
    const request: ClientMessage = { type: MessageType.PLAYER_INPUT, payload: { playerId, input } }
    ClientSocket.send(JSON.stringify(request));
}

export const sendPerceptionUpdate = () => { 
    const timeStamp = (new Date()).getTime();
    const currentState = PlayerStore.getState().playerStatusMap
    let locationMap = {};
    Object.keys(currentState).forEach(playerId => {
        locationMap = {...locationMap, [playerId]: currentState[playerId].location }
    });
    const request: ClientMessage = { type: MessageType.CLIENT_PERCEPTION_UPDATE, payload: {locationMap, timeStamp } };
    ClientSocket.send(JSON.stringify(request));
}