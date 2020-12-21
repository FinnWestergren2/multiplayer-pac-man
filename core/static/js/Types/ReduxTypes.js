"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerStateActionTypes = exports.MapStateActionTypes = void 0;
var MapStateActionTypes;
exports.MapStateActionTypes = MapStateActionTypes;

(function (MapStateActionTypes) {
  MapStateActionTypes["REFRESH_MAP"] = "REFRESH_MAP";
  MapStateActionTypes["UPDATE_APP_DIMENSIONS"] = "UPDATE_APP_DIMENSIONS";
  MapStateActionTypes["UPDATE_CELL_DIMENSIONS"] = "UPDATE_CELL_DIMENSIONS";
})(MapStateActionTypes || (exports.MapStateActionTypes = MapStateActionTypes = {}));

var PlayerStateActionTypes;
exports.PlayerStateActionTypes = PlayerStateActionTypes;

(function (PlayerStateActionTypes) {
  PlayerStateActionTypes["SET_OBJECT_STATUS"] = "SET_OBJECT_STATUS";
  PlayerStateActionTypes["SET_OBJECT_STATUSES"] = "SET_OBJECT_STATUSES";
  PlayerStateActionTypes["ADD_PLAYER_INPUT"] = "ADD_PLAYER_INPUT";
  PlayerStateActionTypes["ADD_PLAYER"] = "ADD_PLAYER";
  PlayerStateActionTypes["REMOVE_PLAYER"] = "REMOVE_PLAYER";
  PlayerStateActionTypes["SET_CURRENT_PLAYER_ID"] = "SET_CURRENT_PLAYER_ID";
  PlayerStateActionTypes["SET_PLAYER_LIST"] = "SET_PLAYER_LIST";
  PlayerStateActionTypes["SOFT_SET_OBJECT_STATUSES"] = "SOFT_SET_OBJECT_STATUSES";
  PlayerStateActionTypes["RESOLVE_SOFT_UPDATE"] = "RESOLVE_SOFT_UPDATE";
  PlayerStateActionTypes["SET_OBJECT_DESTINATION"] = "SET_OBJECT_DESTINATION";
})(PlayerStateActionTypes || (exports.PlayerStateActionTypes = PlayerStateActionTypes = {}));

;