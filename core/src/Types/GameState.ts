import { CoordPair } from "./CoordPair"
import { Directions } from "./Directions"
import { Input } from "./InputTypes"

export type ObjectStatus = {
    location: CoordPair;
    direction: Directions;
}

export type StampedInput = {
    time: number;
    input: Input;
}

export type ObjectDict<T> = { [playerId: string]: T }