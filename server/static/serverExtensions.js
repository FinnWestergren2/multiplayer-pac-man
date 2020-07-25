"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleMessage = handleMessage;

var _shared = require("shared");

function handleMessage(message) {
  switch (message.type) {
    case _shared.MessageType.PING:
      return {
        type: _shared.MessageType.PONG,
        payload: new Date().getTime() - message.payload
      };
  }
}