import { ClientMessage, MessageType, ServerMessage } from "core";
import { handleMessage, pingServer, sendPerceptionUpdate } from "./clientExtensions";

export const PERCEPTION_UPDATE_PERIOD = 501;
export const PING_PERIOD = 37;

export default () => {
    const ws = new WebSocket('ws://localhost:8080', ['json', 'xml']);

    ws.addEventListener('open', () => {
        const data: ClientMessage = { type: MessageType.MAP_REQUEST }
        const json = JSON.stringify(data);
        ws.send(json);
        setInterval(sendPerceptionUpdate, PERCEPTION_UPDATE_PERIOD)
        setInterval(pingServer, PING_PERIOD)
    });
    
    ws.addEventListener('message', event => {
        const data: ServerMessage = JSON.parse(event.data);
        handleMessage(data);
    });

    ws.onclose = () => console.log('closing...');

    return ws;
};
