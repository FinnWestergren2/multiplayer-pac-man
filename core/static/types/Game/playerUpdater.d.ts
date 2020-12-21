import { ObjectStatus } from '../Types/GameState';
import { CoordPair } from '../Types';
export declare const updatePlayers: () => void;
export declare const moveObjectAlongPath: (dist: number, path: CoordPair[], status: ObjectStatus) => ObjectStatus;
