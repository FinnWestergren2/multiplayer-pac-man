import { ClientRequest, MessageType, ServerResponse } from "shared";
import { handleMessage } from "./clientExtensions";

export default () => {
    const ws = new WebSocket('ws://localhost:8080', ['json', 'xml']);

    ws.addEventListener('open', () => {
        const data: ClientRequest = { type: MessageType.HELLO, payload: null }
        const json = JSON.stringify(data);
        ws.send(json);
    });
    
    ws.addEventListener('message', event => {
        const data: ServerResponse = JSON.parse(event.data);
        handleMessage(data);
    });

    ws.onclose = () => console.log('closing...');

    return ws;
};