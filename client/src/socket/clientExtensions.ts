import { 
    MessageType,
    ServerMessage,
    ClientMessage,
    setCurrentPlayers,
    addPlayer,
    removePlayer,
    handlePlayerInput,
    handleStateCorrection,
    setPlayerStatus,
    StampedInput,
    refreshMap
} from "core";

import { MapStore, ClientSocket, GameStore } from "../containers/GameWrapper";

export function handleMessage(message: ServerMessage): void {
    switch (message.type) {
        case MessageType.PONG:
            return;
        case MessageType.INIT_PLAYER:
            setCurrentPlayers(GameStore, message.payload.currentPlayerId, message.payload.fullPlayerList);
            setPlayerStatus(GameStore, message.payload.objectStatusDict);
            return;
        case MessageType.MAP_RESPONSE:
            //@ts-ignore
            MapStore.dispatch(refreshMap(message.payload));
            return;
        case MessageType.ADD_PLAYER:
            addPlayer(GameStore, message.payload);
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
        case MessageType.STATE_OVERRIDE:
            setPlayerStatus(GameStore, message.payload);
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
    const request: ClientMessage = { type: MessageType.PING, payload: { time: (new Date()).getTime(), playerId: GameStore.getState().currentPlayer! } }
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
    const currentState = GameStore.getState().objectStatusDict
    let locationMap = {};
    Object.keys(currentState).forEach(playerId => {
        locationMap = {...locationMap, [playerId]: currentState[playerId].location }
    });
    const request: ClientMessage = { type: MessageType.CLIENT_PERCEPTION_UPDATE, payload: {locationMap, timeStamp } };
    ClientSocket.send(JSON.stringify(request));
}