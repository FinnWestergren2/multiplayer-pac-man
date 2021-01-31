import { Direction } from "./direction";

export type CoordPair = { x: number, y: number }
const zeroPair = { x: 0, y: 0 };
const addPairs = (p1: CoordPair, p2: CoordPair) => {
    return { x: p1.x + p2.x, y: p1.y + p2.y }
}

const randomPair: (dimensions: CoordPair) => CoordPair = (dimensions) => {
    const x = Math.floor(Math.random() * dimensions.x);
    const y = Math.floor(Math.random() * dimensions.y);
    return { x, y }
}

const equalPairs: (a: CoordPair, b: CoordPair) => boolean = (a, b) => a.x === b.x && a.y === b.y;

const roundedPair = (p: CoordPair) => {
    return { x: Math.round(p.x), y: Math.round(p.y) }
}

const flooredPair = (p: CoordPair) => {
    return { x: Math.floor(p.x), y: Math.floor(p.y) }
}

const getDirection = (start: CoordPair, finish: CoordPair) => {
    let out = Direction.NONE;
    if (start.x < finish.x) {
        out = out | Direction.RIGHT;
    }
    if (start.x > finish.x) {
        out = out | Direction.LEFT;
    }
    if (start.y < finish.y) {
        out = out | Direction.DOWN;
    }
    if (start.y > finish.y) {
        out = out | Direction.UP;
    }
    return out
}

const snappedPair = (p: CoordPair) => {
    const rounded = roundedPair(p);
    if (Math.abs(p.x - rounded.x) > Math.abs(p.y - rounded.y)) {
        return { x: p.x, y: rounded.y };
    }
    else {
        return { x: rounded.x, y: p.y };
    }
}

const distSquared = (start: CoordPair, finish: CoordPair) => Math.pow(Math.abs(start.x - finish.x), 2) + Math.pow(Math.abs(start.y - finish.y), 2)

export const CoordPairUtils = { zeroPair, addPairs, randomPair, equalPairs, roundedPair, flooredPair, snappedPair, getDirection, distSquared };