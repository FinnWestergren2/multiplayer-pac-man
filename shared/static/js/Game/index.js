"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runGame = void 0;

var _Game = _interopRequireDefault(require("./Game"));

var runGame = function runGame(mapStore, playerStore) {
  var game = new _Game.default(mapStore, playerStore);
  window.setInterval(game.update, 10);
};

exports.runGame = runGame;