import { ClientMessage, MessageType, ServerMessage } from "shared";
import { handleMessage } from "./clientExtensions";

export default () => {
    const ws = new WebSocket('ws://localhost:8080', ['json', 'xml']);

    ws.addEventListener('open', () => {
        const data: ClientMessage = { type: MessageType.MAP_REQUEST, payload: null }
        const json = JSON.stringify(data);
        ws.send(json);
    });
    
    ws.addEventListener('message', event => {
        const data: ServerMessage = JSON.parse(event.data);
        handleMessage(data);
    });

    ws.onclose = () => console.log('closing...');

    return ws;
};
