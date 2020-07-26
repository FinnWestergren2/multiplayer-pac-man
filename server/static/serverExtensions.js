"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleMessage = handleMessage;

var _shared = require("shared");

var _mapGenerator = require("./utils/mapGenerator");

function handleMessage(message) {
  switch (message.type) {
    case _shared.MessageType.PING:
      return {
        type: _shared.MessageType.PONG,
        payload: new Date().getTime() - message.payload
      };

    case _shared.MessageType.HELLO:
      return {
        type: _shared.MessageType.HELLO,
        payload: null
      };

    case _shared.MessageType.MAP_REQUEST:
      return {
        type: _shared.MessageType.MAP_RESPONSE,
        payload: getCurrentMap(message.payload)
      };

    default:
      return {
        type: _shared.MessageType.INVALID,
        payload: null
      };
  }
}

var getCurrentMap = function getCurrentMap(pIds) {
  return (0, _mapGenerator.generateMapUsingRandomDFS)(pIds);
};