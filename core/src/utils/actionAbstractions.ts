import { GameStore, StampedInput, UPDATE_FREQUENCY, SPEED_FACTOR, popActorPath, updateActorStatus, setActorPath, Dictionary, CoordPair, ActorStatus, addPlayer } from "..";
import { addActor } from "../ducks";
import { BFS, moveActorAlongPath } from "../game/actorUpdater";
import { ActorType, CoordPairUtils, InputType } from "../types";

export const handlePlayerInput = (store: GameStore, playerId: string, stampedInput: StampedInput) => {
    switch(stampedInput.input.type) {
        case InputType.MOVE_UNIT:
            const actorStatus = store.getState().actorDict[stampedInput.input.actorId]?.status;
            if (!actorStatus) return;

            const path = BFS(stampedInput.input.origin, stampedInput.input.destination);
            const frameDiff = stampedInput.timeAgo * UPDATE_FREQUENCY;
            const distTravelled = SPEED_FACTOR * frameDiff;
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

export const handleStateCorrection = (store: GameStore, payload: { soft: Dictionary<CoordPair>, hard: Dictionary<ActorStatus> }) => {
    const { hard, soft } = payload;
    Object.keys(store.getState().actorDict).forEach(actorId => {
        const newState = hard[actorId] ?? { ...store.getState().actorDict[actorId], location: soft[actorId] ?? store.getState().actorDict[actorId].status.location };
        updateActorStatus(store, actorId, newState);
    })
}

export const initPlayer = (store: GameStore, playerId: string, championId: string) => {
    addPlayer(store, playerId);
    addActor(store, playerId, championId, ActorType.CHAMPION, CoordPairUtils.zeroPair);
}
