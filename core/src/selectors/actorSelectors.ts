import { createCachedSelector } from 're-reselect'
import { ActorState, ActorStatus, CoordPair, Direction, MapState } from '../types'


export const getActorStatus = createCachedSelector(
    (actorState: ActorState, actorId: string) => actorState.actorDict[actorId].status,
    (actorState: ActorState, actorId: string) => actorId,
    (actorStatus: ActorStatus, actorId) => {
        console.log(`beep boop recalculating ${actorId} ${actorStatus.location.x}, ${actorStatus.location.y}`);
        return `${actorId} ${actorStatus.location.x}, ${actorStatus.location.y}`;
    }
)(
    (actorState: ActorState, actorId: string) => actorId
)
