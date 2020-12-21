import { CoordPair } from "./CoordPair";
import { Directions } from "./Directions";
import { Input } from "./InputTypes";
export declare type ObjectStatus = {
    location: CoordPair;
    direction: Directions;
};
export declare type StampedInput = {
    time: number;
    input: Input;
};
export declare type ObjectDict<T> = {
    [playerId: string]: T;
};
