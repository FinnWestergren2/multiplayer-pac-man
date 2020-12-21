"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameStateActionTypes = exports.MapStateActionTypes = void 0;
var MapStateActionTypes;
exports.MapStateActionTypes = MapStateActionTypes;

(function (MapStateActionTypes) {
  MapStateActionTypes["REFRESH_MAP"] = "REFRESH_MAP";
  MapStateActionTypes["UPDATE_APP_DIMENSIONS"] = "UPDATE_APP_DIMENSIONS";
  MapStateActionTypes["UPDATE_CELL_DIMENSIONS"] = "UPDATE_CELL_DIMENSIONS";
})(MapStateActionTypes || (exports.MapStateActionTypes = MapStateActionTypes = {}));

var GameStateActionTypes;
exports.GameStateActionTypes = GameStateActionTypes;

(function (GameStateActionTypes) {
  GameStateActionTypes["SET_OBJECT_STATUS"] = "SET_OBJECT_STATUS";
  GameStateActionTypes["SET_OBJECT_STATUSES"] = "SET_OBJECT_STATUSES";
  GameStateActionTypes["ADD_PLAYER_INPUT"] = "ADD_PLAYER_INPUT";
  GameStateActionTypes["ADD_PLAYER"] = "ADD_PLAYER";
  GameStateActionTypes["REMOVE_PLAYER"] = "REMOVE_PLAYER";
  GameStateActionTypes["SET_CURRENT_PLAYER_ID"] = "SET_CURRENT_PLAYER_ID";
  GameStateActionTypes["SET_PLAYER_LIST"] = "SET_PLAYER_LIST";
  GameStateActionTypes["SOFT_SET_OBJECT_STATUSES"] = "SOFT_SET_OBJECT_STATUSES";
  GameStateActionTypes["RESOLVE_SOFT_UPDATE"] = "RESOLVE_SOFT_UPDATE";
  GameStateActionTypes["SET_OBJECT_PATH"] = "SET_OBJECT_PATH";
  GameStateActionTypes["POP_OBJECT_PATH"] = "POP_OBJECT_PATH";
})(GameStateActionTypes || (exports.GameStateActionTypes = GameStateActionTypes = {}));

;