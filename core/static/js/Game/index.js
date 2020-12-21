"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runGame = exports.playerStore = exports.mapStore = exports.SPEED_FACTOR = exports.UPDATE_FREQUENCY = void 0;

var _playerUpdater = require("./playerUpdater");

var FRAME_LENGTH = 16;
var UPDATE_FREQUENCY = 1 / FRAME_LENGTH;
exports.UPDATE_FREQUENCY = UPDATE_FREQUENCY;
var SPEED_FACTOR = 0.08;
exports.SPEED_FACTOR = SPEED_FACTOR;
var mapStore;
exports.mapStore = mapStore;
var playerStore;
exports.playerStore = playerStore;

var runGame = function runGame(ms, ps, updateInterval) {
  exports.mapStore = mapStore = ms;
  exports.playerStore = playerStore = ps;
  updateInterval(update, FRAME_LENGTH);
};

exports.runGame = runGame;

var update = function update() {
  (0, _playerUpdater.updatePlayers)();
};