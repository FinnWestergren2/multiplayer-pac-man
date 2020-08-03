import { MessageType, ServerMessage, ClientMessage, Directions, setCurrentPlayers, addPlayer, removePlayer, addPlayerInput } from "shared";
import { MapStore, ClientSocket, PlayerStore } from "../containers/GameWrapper";
import { refreshMap } from "shared";

export function handleMessage(message: ServerMessage): void {
    switch (message.type) {
        case MessageType.PONG:
            console.log(message.payload)
            return;
        case MessageType.INIT_PLAYER:
            // @ts-ignore
            PlayerStore.dispatch(setCurrentPlayers(message.payload.currentPlayerId, message.payload.fullPlayerList));
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
            // @ts-ignore
            PlayerStore.dispatch(addPlayerInput(message.payload.playerId, message.payload.input));
            return;
        case MessageType.INVALID:
            console.log('sent an invalid message to server')
            return;
        default:
            console.log('recieved an invalid message type from server')
            return;
    }
}

export const pingServer = () => {
    const request: ClientMessage = { type: MessageType.PING, payload: (new Date()).getTime() }
    ClientSocket.send(JSON.stringify(request));
}

export const requestMap = () => {
    const request: ClientMessage = { type: MessageType.MAP_REQUEST, payload: null }
    ClientSocket.send(JSON.stringify(request));
}

export const sendPlayerInput = (playerId: string, dir: Directions) => {
    const request: ClientMessage = { type: MessageType.PLAYER_INPUT, payload: { playerId, input: { frame: (new Date()).getTime(), direction: dir } } }
    ClientSocket.send(JSON.stringify(request));
}