import { Directions } from "./Directions";
export declare type CoordPair = {
    x: number;
    y: number;
};
export declare const CoordPairUtils: {
    zeroPair: {
        x: number;
        y: number;
    };
    addPairs: (p1: CoordPair, p2: CoordPair) => {
        x: number;
        y: number;
    };
    randomPair: (dimensions: CoordPair) => CoordPair;
    equalPairs: (a: CoordPair, b: CoordPair) => boolean;
    roundedPair: (p: CoordPair) => {
        x: number;
        y: number;
    };
    flooredPair: (p: CoordPair) => {
        x: number;
        y: number;
    };
    getDirection: (start: CoordPair, finish: CoordPair) => Directions;
};
