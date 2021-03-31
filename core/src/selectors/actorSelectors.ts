import { createCachedSelector } from 're-reselect'
import { ActorState, ActorStatus, CoordPair, Direction, MapState } from '../types'


export const getActorStatus = createCachedSelector(
    (actorState: ActorState, actorId: string) => actorState.actorDict[actorId].status.location,
    (actorState: ActorState, actorId: string) => actorId,
    (location, actorId) => {
        console.log(`beep boop recalculatin' ${actorId} ${location.x}, ${location.y}`);
        return `${actorId} ${location.x}, ${location.y}`;
    }
)(
    (actorState: ActorState, actorId: string) => actorId
)
