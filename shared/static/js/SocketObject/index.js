"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageType = void 0;
// id keep these as numbers to keep the packet size low
// export enum MessageType {
//     SET_CURRENT_PLAYER,
//     PING,
//     PONG,
//     MAP_REQUEST,
//     MAP_RESPONSE,
//     PLAYER_INPUT,
//     PLAYER_STATUS_UPDATE,
//     ADD_PLAYER,
//     REMOVE_PLAYER,
//     INVALID
// }
// for debug
var MessageType;
exports.MessageType = MessageType;

(function (MessageType) {
  MessageType["INIT_PLAYER"] = "INIT_PLAYER";
  MessageType["PING"] = "PING";
  MessageType["PONG"] = "PONG";
  MessageType["MAP_REQUEST"] = "MAP_REQUEST";
  MessageType["MAP_RESPONSE"] = "MAP_RESPONSE";
  MessageType["PLAYER_INPUT"] = "PLAYER_INPUT";
  MessageType["ADD_PLAYER"] = "ADD_PLAYER";
  MessageType["REMOVE_PLAYER"] = "REMOVE_PLAYER";
  MessageType["INVALID"] = "INVALID";
})(MessageType || (exports.MessageType = MessageType = {}));