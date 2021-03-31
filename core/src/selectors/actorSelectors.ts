import { createCachedSelector } from 're-reselect'
import { ActorState, ActorStatus, CoordPair, CoordPairUtils, Direction, MapState } from '../types'


export const getActorStatus = createCachedSelector(
    (actorState: ActorState, actorId: string) => CoordPairUtils.hash(CoordPairUtils.roundedPair(actorState.actorDict[actorId].status.location)),
    (actorState: ActorState, actorId: string) => actorId,
    (hashLocation, actorId) => {
        const location = CoordPairUtils.unhash(hashLocation);
        console.log(`beep boop recalculating... ${actorId} ${location.x}, ${location.y} ${hashLocation}`);
        return `${actorId} ${location.x}, ${location.y}`;
    }
)(
    (actorState: ActorState, actorId: string) => actorId
)
