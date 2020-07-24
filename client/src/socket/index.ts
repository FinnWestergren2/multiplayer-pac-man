export default () => {
    const ws = new WebSocket('ws://localhost:8080', ['json', 'xml']);

    ws.addEventListener('open', () => {
        const data = { message: 'Hello from client' }
        const json = JSON.stringify(data);
        ws.send(json);
    });
    
    ws.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        console.log(data.message);
        // TODO do something with this data. Move it to the global store.
    });

    ws.onclose = () => console.log('closing...');

    return ws;
};