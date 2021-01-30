import { 
    MessageType,
    ServerMessage,
    ClientMessage,
    removePlayer,
    handlePlayerInput,
    handleStateCorrection,
    StampedInput,
    refreshMap,
    initPlayer,
    setGameState
} from "core";

import { MapStore, ClientSocket, GameStore } from "../containers/GameWrapper";

let lastPing = 0;

export function handleMessage(message: ServerMessage): void {
    switch (message.type) {
        case MessageType.PONG:
            const ping = getTime() - lastPing;
            console.log("ping", ping, getTime(), lastPing);
            sendLatencyUpdate(ping);
            return;
        case MessageType.INIT_PLAYER:
            setGameState(GameStore, message.payload);
            return;
        case MessageType.MAP_RESPONSE:
            refreshMap(MapStore, message.payload);
            return;
        case MessageType.ADD_PLAYER:
            initPlayer(GameStore, message.payload.playerId, message.payload.championId);
            return;
        case MessageType.REMOVE_PLAYER:
            removePlayer(GameStore, message.payload);
            return;
        case MessageType.PLAYER_INPUT:
            handlePlayerInput(GameStore, message.payload.playerId, message.payload.input);
            return;
        case MessageType.INVALID:
            console.error('sent an invalid message to server')
            return;
        case MessageType.STATE_CORRECTION:
            handleStateCorrection(GameStore, message.payload);
            return
        default:
            console.error('recieved an invalid message type from server')
            return;
    }
}

export const pingServer = () => {
    const request: ClientMessage = { type: MessageType.PING }
    lastPing = getTime();
    trySend(JSON.stringify(request));
}

export const requestMap = () => {
    const request: ClientMessage = { type: MessageType.MAP_REQUEST }
    trySend(JSON.stringify(request));
}

export const sendPlayerInput = (playerId: string, input: StampedInput) => {
    const request: ClientMessage = { type: MessageType.PLAYER_INPUT, payload: { playerId, input } }
    trySend(JSON.stringify(request));
}

export const sendPerceptionUpdate = () => { 
    const timeStamp = (new Date()).getTime();
    const currentState = GameStore.getState().actorDict
    let locationMap = {};
    Object.keys(currentState).forEach(playerId => {
        locationMap = {...locationMap, [playerId]: currentState[playerId].status.location }
    });
    const request: ClientMessage = { type: MessageType.CLIENT_PERCEPTION_UPDATE, payload: {locationMap, timeStamp } };
    trySend(JSON.stringify(request));
}

export const sendSimulatedLagInput = (lag: number) => {
    const request: ClientMessage = { type: MessageType.SET_SIMULATED_LAG, payload: lag };
    trySend(JSON.stringify(request));
}

const sendLatencyUpdate = (lag: number) => {
    const request: ClientMessage = { type: MessageType.LATENCY_UPDATE, payload: lag };
    trySend(JSON.stringify(request));
}

const trySend = (message: string) => {
    if (ClientSocket.readyState === 1) {
        ClientSocket.send(message);
        return true;
    }
    return false;
}

const getTime = () => (new Date()).getTime();