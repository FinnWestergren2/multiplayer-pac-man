import { createCachedSelector } from 're-reselect'
import { CoordPair, CoordPairUtils, ReduxState} from '../types'
import { dijkstras } from '../utils/dijkstra';
import { junctionSelector } from './mapSelectors';

const actorLocationSelector = (state: ReduxState, actorId: string) => 
    CoordPairUtils.serialize(CoordPairUtils.roundedPair(state.actorState.actorDict[actorId].status.location));
const actorDestinationSelector = (state: ReduxState, actorId: string) => {
    console.log(state.actorState.actorDict[actorId].status.destination);
    return CoordPairUtils.serialize(CoordPairUtils.roundedPair(state.actorState.actorDict[actorId].status.destination ?? state.actorState.actorDict[actorId].status.location));
}
    
export const getActorPath = createCachedSelector(
    (state: ReduxState,  _actorId: string) => junctionSelector(state.mapState),
    actorLocationSelector,
    actorDestinationSelector,
    (junctions, serializedOrigin, serializedDestination) => {
        return dijkstras(CoordPairUtils.deserialize(serializedOrigin), CoordPairUtils.deserialize(serializedDestination), junctions);
    }
)(
    (state: ReduxState, actorId: string) => actorId
)
