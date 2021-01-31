import { CoordPair } from "./coordPairs"
import { Directions } from "./direction"
import { Input } from "./input"

export type Actor = {
    ownerId: string;
    type: ActorType;
    status: ActorStatus;
}

export type ActorStatus = {
    location: CoordPair;
    direction: Directions;
}

export enum ActorType {
    CHAMPION = "CHAMPION",
    MINER = "MINER"
}

export type StampedInput = {
    timeAgo: number;
    input: Input;
}

export type Dictionary<T> = { [id: string]: T }