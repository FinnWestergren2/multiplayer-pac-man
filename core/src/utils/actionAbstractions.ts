import { ReduxStore, StampedInput, updateActorStatus, Dictionary, CoordPair, ActorStatus, addPlayer, CELLS_PER_MILLISECOND, getUpdateFrequency } from "..";
import { addActor } from "../ducks";
import { moveActorAlongPath } from "../game/actorUpdater";
import { ActorType, CoordPairUtils, InputType } from "../types";

export const handlePlayerInput = (store: ReduxStore, playerId: string, stampedInput: StampedInput) => {
    switch(stampedInput.input.type) {
        case InputType.MOVE_UNIT:
            const actorStatus = store.getState().actorState.actorDict[stampedInput.input.actorId]?.status;
            if (!actorStatus) return;
            const newStatus = {...actorStatus, destination: stampedInput.input.destination};
            updateActorStatus(store, stampedInput.input.actorId, newStatus);
            const frameDiff = stampedInput.timeAgo * getUpdateFrequency();
            const distTravelled = CELLS_PER_MILLISECOND * frameDiff;
            console.log('time ago', stampedInput.timeAgo, 'frame diff', frameDiff, 'dist travelled', distTravelled);
            moveActorAlongPath(distTravelled, stampedInput.input.actorId)
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
