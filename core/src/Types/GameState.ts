import { CoordPair } from "./CoordPair"
import { Directions } from "./Directions"
import { Input } from "./InputTypes"

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