import { CoordPair } from "./CoordPair"
import { Directions } from "./Directions"

export type PlayerStatus = { 
    location: CoordPair,
    direction: Directions,
    nextDirection: Directions
}

export type StampedInput = {
    frame: number;
    direction: Directions;
}

export type PlayerStatusMap = { [playerId: string]: PlayerStatus }
export type PlayerInputHistory = { [playerId: string]: StampedInput[] }