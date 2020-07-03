import { connection as Connection } from 'websocket';
import { generateMapUsingRandomDFS } from './utils/mapGenerator';

enum Endpoint {
    GenerateMap = "generateMap"
}

export default Endpoint