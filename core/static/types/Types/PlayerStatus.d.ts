import { CoordPair } from "./CoordPair";
import { Directions } from "./Directions";
import { Input } from "./InputTypes";
export declare type PlayerStatus = {
    location: CoordPair;
    direction: Directions;
    path: CoordPair[];
};
export declare type StampedInput = {
    time: number;
    input: Input;
};
export declare type PlayerStatusMap = {
    [playerId: string]: PlayerStatus;
};
export declare type PlayerLocationMap = {
    [playerId: string]: CoordPair;
};
