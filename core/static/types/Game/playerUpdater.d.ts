import { PlayerStatus } from '../Types/PlayerStatus';
import { PlayerStore } from '../Types';
export declare const updatePlayers: () => void;
export declare const movePlayerAlongPath: (playerId: string, status: PlayerStatus, dist: number, store: PlayerStore) => void;
