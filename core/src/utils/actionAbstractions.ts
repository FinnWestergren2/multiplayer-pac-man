import { GameStore, StampedInput, getUpdateFrequency, CELLS_PER_MILLISECOND, popActorPath, updateActorStatus, setActorPath, Dictionary, CoordPair, ActorStatus, addPlayer } from "..";
import { addActor } from "../ducks";
import { BFS, BFSWithNodes, moveActorAlongPath } from "../game/actorUpdater";
import { ActorType, CoordPairUtils, InputType } from "../types";

export const handlePlayerInput = (store: GameStore, playerId: string, stampedInput: StampedInput) => {
    switch(stampedInput.input.type) {
        case InputType.MOVE_UNIT:
            const actorStatus = store.getState().actorDict[stampedInput.input.actorId]?.status;
            if (!actorStatus) return;
            const a = (new Date).getTime();
            const path = BFSWithNodes(stampedInput.input.origin, stampedInput.input.destination);
            const b = (new Date).getTime();
            const path2 = BFS(stampedInput.input.origin, stampedInput.input.destination);
            const c = (new Date).getTime();
            console.log('time diff with nodes', (c - b) - (b - a) )
            const memA = JSON.stringify(path).length;
            const memB = JSON.stringify(path2).length
            console.log('mem diff with nodes', memB - memA, (memB - memA) / memB)
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
