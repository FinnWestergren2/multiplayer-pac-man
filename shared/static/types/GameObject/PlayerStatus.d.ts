import { CoordPair } from "./CoordPair";
import { Directions } from "./Directions";
export declare type PlayerStatus = {
    location: CoordPair;
    direction: Directions;
};
export declare type StampedInput = {
    frame: number;
    direction: Directions;
};
export declare type PlayerStatusMap = {
    [playerId: string]: PlayerStatus;
};
export declare type PlayerInputHistory = {
    [playerId: string]: StampedInput[];
};
