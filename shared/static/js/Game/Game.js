"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Player = require("./Player");

var Game = function Game(_mapStore, _playerStore) {
  var _this = this;

  (0, _classCallCheck2.default)(this, Game);
  (0, _defineProperty2.default)(this, "players", []);
  (0, _defineProperty2.default)(this, "playerList", []);
  (0, _defineProperty2.default)(this, "initializePlayers", function (mapStore, playerStore) {
    _this.players = playerStore.getState().playerList.map(function (pId) {
      return new _Player.Player(0, 0, pId, mapStore, playerStore);
    });
  });
  (0, _defineProperty2.default)(this, "update", function () {
    _this.players.forEach(function (p) {
      p.updateState();
    });
  });

  _playerStore.subscribe(function () {
    var previousPlayerList = (0, _toConsumableArray2.default)(_this.playerList);
    _this.playerList = _playerStore.getState().playerList;

    if (JSON.stringify(previousPlayerList) !== JSON.stringify(_this.playerList)) {
      _this.initializePlayers(_mapStore, _playerStore);
    }
  });
};

exports.default = Game;
;