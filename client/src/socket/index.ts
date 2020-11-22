import { ClientMessage, MessageType, ServerMessage } from "shared";
import { handleMessage, pingServer, sendPerceptionUpdate } from "./clientExtensions";

export default () => {
    const ws = new WebSocket('ws://localhost:8080', ['json', 'xml']);

    ws.addEventListener('open', () => {
        const data: ClientMessage = { type: MessageType.MAP_REQUEST, payload: null }
        const json = JSON.stringify(data);
        ws.send(json);
        setInterval(sendPerceptionUpdate, 20)
        setInterval(pingServer, 1000)
    });
    
    ws.addEventListener('message', event => {
        const data: ServerMessage = JSON.parse(event.data);
        handleMessage(data);
    });

    ws.onclose = () => console.log('closing...');

    return ws;
};
