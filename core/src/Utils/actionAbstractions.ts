import { GameStore, StampedInput, UPDATE_FREQUENCY, SPEED_FACTOR, popPlayerPath, updateActorStatus, setActorPath, Dictionary, CoordPair, ActorStatus } from "..";
import { BFS, moveActorAlongPath } from "../Game/actorUpdater";

export const handlePlayerInput = (store: GameStore, playerId: string, stampedInput: StampedInput) => {
    const playerStatus = store.getState().actorDict[playerId]?.status;
    if (playerStatus) {
        const path = BFS(stampedInput.input.currentLocation, stampedInput.input.destination);
        const frameDiff = stampedInput.timeAgo * UPDATE_FREQUENCY;
        const distTravelled = SPEED_FACTOR * frameDiff;
        console.log(frameDiff, distTravelled, UPDATE_FREQUENCY);
        const newStatus = moveActorAlongPath(distTravelled, path, { ...playerStatus, location: stampedInput.input.currentLocation }, () => popPlayerPath(store, playerId));
        updateActorStatus(store, playerId, newStatus);
        setActorPath(store, playerId, path);
    }
}

export const handleStateCorrection = (store: GameStore, payload: { soft: Dictionary<CoordPair>, hard: Dictionary<ActorStatus> }) => {
    const { hard, soft } = payload;
    store.getState().playerList.forEach(pId => {
        const newState = hard[pId] ?? { ...store.getState().actorDict[pId], location: soft[pId] ?? store.getState().actorDict[pId].status.location };
        updateActorStatus(store, pId, newState);
    })
}
