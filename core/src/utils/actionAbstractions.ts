import { ReduxStore, StampedInput, getUpdateFrequency, CELLS_PER_MILLISECOND, popActorPath, updateActorStatus, setActorPath, Dictionary, CoordPair, ActorStatus, addPlayer } from "..";
import { addActor } from "../ducks";
import { Dijkstras, moveActorAlongPath } from "../game/actorUpdater";
import { ActorType, CoordPairUtils, InputType } from "../types";

export const handlePlayerInput = (store: ReduxStore, playerId: string, stampedInput: StampedInput) => {
    switch(stampedInput.input.type) {
        case InputType.MOVE_UNIT:
            const actorStatus = store.getState().actorState.actorDict[stampedInput.input.actorId]?.status;
            if (!actorStatus) return;
            const startCell = CoordPairUtils.roundedPair(stampedInput.input.origin);
            const endCell = stampedInput.input.destination;
            const path = CoordPairUtils.equalPairs(startCell, endCell) 
                ? [startCell]
                : Dijkstras(startCell, endCell).path;
            const frameDiff = stampedInput.timeAgo * getUpdateFrequency();
            const distTravelled = CELLS_PER_MILLISECOND * frameDiff;
            const newStatus = moveActorAlongPath(
                distTravelled, 
                path, 
                { location: stampedInput.input.origin, direction: actorStatus.direction }, 
                () => popActorPath(store, stampedInput.input.actorId)
            );
            updateActorStatus(store, stampedInput.input.actorId, newStatus);
            setActorPath(store, stampedInput.input.actorId, path);
            return;
        case InputType.CREATE_UNIT:
            addActor(store, playerId, stampedInput.input.actorId, stampedInput.input.actorType, stampedInput.input.destination);
            return;
    }
}

export const handleStateCorrection = (store: ReduxStore, payload: { soft: Dictionary<CoordPair>, hard: Dictionary<ActorStatus> }) => {
    const { hard, soft } = payload;
    Object.keys(store.getState().actorState.actorDict).forEach(actorId => {
        const newState = hard[actorId] ?? { ...store.getState().actorState.actorDict[actorId], location: soft[actorId] ?? store.getState().actorState.actorDict[actorId].status.location };
        updateActorStatus(store, actorId, newState);
    })
}

export const initPlayer = (store: ReduxStore, playerId: string, championId: string) => {
    addPlayer(store, playerId);
    addActor(store, playerId, championId, ActorType.CHAMPION, CoordPairUtils.zeroPair);
}
