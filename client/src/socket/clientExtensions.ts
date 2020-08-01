import { MessageType, ServerResponse, ClientRequest, updatePlayerStatus } from "shared";
import { MapStore, ClientSocket } from "../containers/GameWrapper";
import { refreshMap } from "shared";

export function handleMessage(message: ServerResponse): void {
    switch (message.type) {
        case MessageType.PONG:
            console.log(message.payload)
            return;
        case MessageType.HELLO:
            console.log('recieved a hello from server')
            return;
        case MessageType.MAP_RESPONSE:
            // @ts-ignore
            MapStore.dispatch(refreshMap(message.payload));
            return;
        case MessageType.PLAYER_STATUS_UPDATE:
            // @ts-ignore
            MapStore.dispatch(updatePlayerStatus(message.payload));
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
	const request: ClientRequest = { type: MessageType.PING, payload: (new Date()).getTime()}
	ClientSocket.send(JSON.stringify(request));
}

export const requestMap = () => {
	const request: ClientRequest = { type: MessageType.MAP_REQUEST, payload: null }
	ClientSocket.send(JSON.stringify(request));
}