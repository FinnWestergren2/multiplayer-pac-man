import { CoordPair } from "./CoordPair";
import { Directions } from "./Directions";
export declare type PlayerStatus = {
    location: CoordPair;
    direction: Directions;
};
export declare type PlayerStatusMap = {
    [playerId: string]: PlayerStatus;
};
