"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageType = void 0;
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
  MessageType["CLIENT_PERCEPTION_UPDATE"] = "CLIENT_PERCEPTION_UPDATE";
  MessageType["STATE_OVERRIDE"] = "STATE_OVERRIDE";
  MessageType["STATE_CORRECTION"] = "STATE_CORRECTION";
})(MessageType || (exports.MessageType = MessageType = {}));