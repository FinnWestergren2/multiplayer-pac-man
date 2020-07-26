import { CoordPair } from "./CoordPair"
import { Directions } from "./Directions"

export type PlayerStatus = { 
    location: CoordPair,
    direction: Directions
}

export type PlayerStatusMap = { [playerId: string]: PlayerStatus }