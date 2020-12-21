"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  runGame: true,
  SPEED_FACTOR: true,
  UPDATE_FREQUENCY: true
};
Object.defineProperty(exports, "runGame", {
  enumerable: true,
  get: function get() {
    return _Game.runGame;
  }
});
Object.defineProperty(exports, "SPEED_FACTOR", {
  enumerable: true,
  get: function get() {
    return _Game.SPEED_FACTOR;
  }
});
Object.defineProperty(exports, "UPDATE_FREQUENCY", {
  enumerable: true,
  get: function get() {
    return _Game.UPDATE_FREQUENCY;
  }
});

var _Types = require("./Types");

Object.keys(_Types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Types[key];
    }
  });
});

var _SocketObject = require("./SocketObject");

Object.keys(_SocketObject).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SocketObject[key];
    }
  });
});

var _ducks = require("./ducks");

Object.keys(_ducks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ducks[key];
    }
  });
});

var _Game = require("./Game");

var _Pathfinding = require("./Utils/Pathfinding");

Object.keys(_Pathfinding).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Pathfinding[key];
    }
  });
});