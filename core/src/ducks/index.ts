import { combineReducers } from "redux";
import { actorStateReducer } from "./actorState";
import { mapStateReducer } from "./mapState";

export * from "./mapState";
export * from "./actorState";


const combined = combineReducers({
    actorState: actorStateReducer,
    mapState: mapStateReducer
})

export default combined;
