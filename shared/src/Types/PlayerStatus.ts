import { CoordPair } from "./CoordPair"
import { Directions } from "./Directions"
import { Input } from "./InputTypes"

export type PlayerStatus = { 
    location: CoordPair,
    direction: Directions
}

export type StampedInput = {
    frame: number;
    input: Input;
}

export type PlayerStatusMap = { [playerId: string]: PlayerStatus }