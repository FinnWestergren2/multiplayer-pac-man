import { CoordPair } from "./coordPair"
import { Direction } from "./direction"
import { Input } from "./input"

export type Actor = {
    ownerId: string;
    type: ActorType;
    status: ActorStatus;
}

export type ActorStatus = {
    location: CoordPair;
    direction: Direction;
}

export enum ActorType {
    CHAMPION = "CHAMPION",
    MINER = "MINER"
}

export type Dictionary<T> = { [id: string]: T }