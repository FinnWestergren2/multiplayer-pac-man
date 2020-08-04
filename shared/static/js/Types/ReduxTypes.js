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
  PlayerStateActionTypes["UPDATE_PLAYER_STATUS"] = "UPDATE_PLAYER_STATUS";
  PlayerStateActionTypes["ADD_PLAYER_INPUT"] = "ADD_PLAYER_INPUT";
  PlayerStateActionTypes["ADD_PLAYER"] = "ADD_PLAYER";
  PlayerStateActionTypes["REMOVE_PLAYER"] = "REMOVE_PLAYER";
  PlayerStateActionTypes["SET_CURRENT_PLAYER_ID"] = "SET_CURRENT_PLAYER_ID";
  PlayerStateActionTypes["SET_PLAYER_LIST"] = "SET_PLAYER_LIST";
})(PlayerStateActionTypes || (exports.PlayerStateActionTypes = PlayerStateActionTypes = {}));

;