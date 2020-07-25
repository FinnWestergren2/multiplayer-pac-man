"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _GameObjects = require("./GameObjects");

Object.keys(_GameObjects).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _GameObjects[key];
    }
  });
});

var _SocketObjects = require("./SocketObjects");

Object.keys(_SocketObjects).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SocketObjects[key];
    }
  });
});