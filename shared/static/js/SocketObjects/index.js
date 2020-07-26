"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageType = void 0;
var MessageType;
exports.MessageType = MessageType;

(function (MessageType) {
  MessageType[MessageType["HELLO"] = 0] = "HELLO";
  MessageType[MessageType["PING"] = 1] = "PING";
  MessageType[MessageType["PONG"] = 2] = "PONG";
  MessageType[MessageType["MAP_REQUEST"] = 3] = "MAP_REQUEST";
  MessageType[MessageType["MAP_RESPONSE"] = 4] = "MAP_RESPONSE";
  MessageType[MessageType["INVALID"] = 5] = "INVALID";
})(MessageType || (exports.MessageType = MessageType = {}));