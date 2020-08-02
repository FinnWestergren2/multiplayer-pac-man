"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageType = void 0;
// id keep these as numbers to keep the packet size low
var MessageType;
exports.MessageType = MessageType;

(function (MessageType) {
  MessageType[MessageType["SET_CURRENT_PLAYER"] = 0] = "SET_CURRENT_PLAYER";
  MessageType[MessageType["PING"] = 1] = "PING";
  MessageType[MessageType["PONG"] = 2] = "PONG";
  MessageType[MessageType["MAP_REQUEST"] = 3] = "MAP_REQUEST";
  MessageType[MessageType["MAP_RESPONSE"] = 4] = "MAP_RESPONSE";
  MessageType[MessageType["PLAYER_INPUT"] = 5] = "PLAYER_INPUT";
  MessageType[MessageType["PLAYER_STATUS_UPDATE"] = 6] = "PLAYER_STATUS_UPDATE";
  MessageType[MessageType["ADD_PLAYER"] = 7] = "ADD_PLAYER";
  MessageType[MessageType["REMOVE_PLAYER"] = 8] = "REMOVE_PLAYER";
  MessageType[MessageType["INVALID"] = 9] = "INVALID";
})(MessageType || (exports.MessageType = MessageType = {}));