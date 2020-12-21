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

var _ = require(".");

var Game = function Game() {
  var _this = this;

  (0, _classCallCheck2.default)(this, Game);
  (0, _defineProperty2.default)(this, "players", {});
  (0, _defineProperty2.default)(this, "playerIdList", []);
  (0, _defineProperty2.default)(this, "lastOverrideTime", 0);
  (0, _defineProperty2.default)(this, "handleUpdatePlayerList", function () {
    var previousPlayerList = (0, _toConsumableArray2.default)(_this.playerIdList);
    _this.playerIdList = _.playerStore.getState().playerList;

    if (JSON.stringify(previousPlayerList) !== JSON.stringify(_this.playerIdList)) {
      _this.initializePlayers();
    }
  });
  (0, _defineProperty2.default)(this, "handleStatusOverride", function () {
    var previousOverrideTime = _this.lastOverrideTime;
    _this.lastOverrideTime = _.playerStore.getState().lastOverrideTime;

    if (_this.lastOverrideTime > previousOverrideTime) {
      Object.keys(_this.players).filter(function (id) {
        return _.playerStore.getState().playerStatusMap[id];
      }).forEach(function (id) {
        _this.players[id].setCurrentStatus(_.playerStore.getState().playerStatusMap[id]);
      });
    }
  });
  (0, _defineProperty2.default)(this, "initializePlayers", function () {
    Object.keys(_this.players).forEach(function (id) {
      if (!_this.playerIdList.includes(id)) {
        delete _this.players[id];
      }
    });

    _this.playerIdList.filter(function (pId) {
      return !_this.players[pId];
    }).forEach(function (pId) {
      _this.players[pId] = new _Player.Player(pId);
    });
  });
  (0, _defineProperty2.default)(this, "update", function () {
    Object.keys(_this.players).forEach(function (key) {
      _this.players[key].updateState();
    });
  });

  _.playerStore.subscribe(function () {
    _this.handleUpdatePlayerList();

    _this.handleStatusOverride();
  });
};

exports.default = Game;
;