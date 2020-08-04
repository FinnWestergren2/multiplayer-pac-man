"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Types = require("../Types");

var _playerState = require("../ducks/playerState");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var SPEED_FACTOR = 0.035;

var Player = /*#__PURE__*/function () {
  function Player(initX, initY, id, mapStore, playerStore) {
    var _this = this;

    (0, _classCallCheck2.default)(this, Player);
    (0, _defineProperty2.default)(this, "initialPos", void 0);
    (0, _defineProperty2.default)(this, "location", _objectSpread({}, _Types.CoordPairUtils.zeroPair));
    (0, _defineProperty2.default)(this, "velocity", _objectSpread({}, _Types.CoordPairUtils.zeroPair));
    (0, _defineProperty2.default)(this, "speed", 0);
    (0, _defineProperty2.default)(this, "currentDirection", _Types.Directions.NONE);
    (0, _defineProperty2.default)(this, "nextDirection", _Types.Directions.NONE);
    (0, _defineProperty2.default)(this, "mostRecentUpdate", 0);
    (0, _defineProperty2.default)(this, "mapStore", void 0);
    (0, _defineProperty2.default)(this, "playerStore", void 0);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "updateState", function () {
      _this.moveTowardsTarget();

      if (_this.isCentered()) {
        if (_this.nextDirection !== _Types.Directions.NONE) {
          // take the queued direction
          _this.currentDirection = _this.nextDirection;
          _this.nextDirection = _Types.Directions.NONE;
        } else {
          _this.receiveInput(_this.currentDirection); // continue the way you were going

        }
      }

      _this.location = _Types.CoordPairUtils.addPairs(_this.location, _this.velocity); // @ts-ignore

      _this.playerStore.dispatch((0, _playerState.updatePlayerStatus)(_this.id, {
        location: _this.location,
        direction: _this.currentDirection
      }));
    });
    (0, _defineProperty2.default)(this, "getCurrentState", function () {
      return {
        location: _this.location,
        direction: _this.currentDirection
      };
    });
    (0, _defineProperty2.default)(this, "moveTowardsTarget", function () {
      if (_this.currentDirection === _Types.Directions.RIGHT && _this.canMoveRight()) {
        _this.velocity = {
          x: _this.speed,
          y: 0
        };
      }

      if (_this.currentDirection === _Types.Directions.LEFT && _this.canMoveLeft()) {
        _this.velocity = {
          x: -_this.speed,
          y: 0
        };
      }

      if (_this.currentDirection === _Types.Directions.UP && _this.canMoveUp()) {
        _this.velocity = {
          x: 0,
          y: -_this.speed
        };
      }

      if (_this.currentDirection === _Types.Directions.DOWN && _this.canMoveDown()) {
        _this.velocity = {
          x: 0,
          y: _this.speed
        };
      }
    });
    (0, _defineProperty2.default)(this, "isCentered", function () {
      var target = _this.targetLocation();

      var snapX = Math.abs(_this.location.x - target.x) < _this.speed;

      var snapY = Math.abs(_this.location.y - target.y) < _this.speed;

      if (snapX) {
        _this.velocity.x = 0;
        _this.location.x = target.x;
      }

      if (snapY) {
        _this.velocity.y = 0;
        _this.location.y = target.y;
      }

      if (snapX && snapY) {
        return true;
      }
    });
    (0, _defineProperty2.default)(this, "targetLocation", function () {
      return _this.toLocationCoords(_this.targetCell(_this.location, _this.currentDirection));
    });
    (0, _defineProperty2.default)(this, "canMoveRight", function () {
      return _Types.DirectionsUtils.isRight(_this.currentCellType()) || _this.location.x < _this.toLocationCoords(_this.currentCell()).x;
    });
    (0, _defineProperty2.default)(this, "canMoveLeft", function () {
      return _Types.DirectionsUtils.isLeft(_this.currentCellType()) || _this.location.x > _this.toLocationCoords(_this.currentCell()).x;
    });
    (0, _defineProperty2.default)(this, "canMoveUp", function () {
      return _Types.DirectionsUtils.isUp(_this.currentCellType()) || _this.location.y > _this.toLocationCoords(_this.currentCell()).y;
    });
    (0, _defineProperty2.default)(this, "canMoveDown", function () {
      return _Types.DirectionsUtils.isDown(_this.currentCellType()) || _this.location.y < _this.toLocationCoords(_this.currentCell()).y;
    });
    (0, _defineProperty2.default)(this, "notMoving", function () {
      return _this.velocity.x === 0 && _this.velocity.y === 0;
    });
    (0, _defineProperty2.default)(this, "currentCellType", function () {
      return _this.getCellType(_this.currentCell());
    });
    (0, _defineProperty2.default)(this, "targetCellType", function () {
      return _this.getCellType(_this.targetCell(_this.location, _this.currentDirection));
    });
    (0, _defineProperty2.default)(this, "currentCell", function () {
      return _this.toGridCoords(_this.location);
    });
    (0, _defineProperty2.default)(this, "targetCell", function (locationCoords, direction) {
      var currentCell = _this.toGridCoords(locationCoords);

      var translation = _this.toLocationCoords(currentCell);

      var targetCell = _objectSpread({}, currentCell);

      var currentCellType = _this.getCellType(currentCell);

      switch (direction) {
        case _Types.Directions.UP:
          if (locationCoords.y <= translation.y && _Types.DirectionsUtils.isUp(currentCellType)) {
            targetCell.y--;
          }

          break;

        case _Types.Directions.DOWN:
          if (locationCoords.y >= translation.y && _Types.DirectionsUtils.isDown(currentCellType)) {
            targetCell.y++;
          }

          break;

        case _Types.Directions.LEFT:
          if (locationCoords.x <= translation.x && _Types.DirectionsUtils.isLeft(currentCellType)) {
            targetCell.x--;
          }

          break;

        case _Types.Directions.RIGHT:
          if (locationCoords.x >= translation.x && _Types.DirectionsUtils.isRight(currentCellType)) {
            targetCell.x++;
          }

          break;
      }

      return targetCell;
    });
    (0, _defineProperty2.default)(this, "getCellType", function (gridCoords) {
      try {
        return _this.mapStore.getState().mapCells[gridCoords.y][gridCoords.x];
      } catch (error) {
        return _Types.Directions.NONE;
      }
    });
    (0, _defineProperty2.default)(this, "toLocationCoords", function (gridCoords) {
      var halfCellSize = _this.mapStore.getState().cellDimensions.halfCellSize;

      return {
        x: gridCoords.x * (halfCellSize * 2) + halfCellSize,
        y: gridCoords.y * (halfCellSize * 2) + halfCellSize
      };
    });
    (0, _defineProperty2.default)(this, "toGridCoords", function (locationCoords) {
      var factor = 1 / _this.mapStore.getState().cellDimensions.cellSize;

      return {
        x: Math.floor(locationCoords.x * factor),
        y: Math.floor(locationCoords.y * factor)
      };
    });
    console.log('init');
    this.mapStore = mapStore;
    this.playerStore = playerStore;
    this.initialPos = {
      x: initX,
      y: initY
    };
    var _this$mapStore$getSta = this.mapStore.getState().cellDimensions,
        cellSize = _this$mapStore$getSta.cellSize,
        _halfCellSize = _this$mapStore$getSta.halfCellSize;
    this.speed = cellSize * SPEED_FACTOR;
    this.location = {
      x: cellSize * this.initialPos.x + _halfCellSize,
      y: cellSize * this.initialPos.y + _halfCellSize
    };
    this.velocity = _objectSpread({}, _Types.CoordPairUtils.zeroPair);
    this.currentDirection = _Types.Directions.NONE;
    this.nextDirection = _Types.Directions.NONE;
    this.id = id;
    this.playerStore.subscribe(function () {
      console.log('updating', _this.playerStore.getState().playerInputHistory[id]);
      var previousUpdate = _this.mostRecentUpdate;

      var myInputHistory = _this.playerStore.getState().playerInputHistory[id];

      _this.mostRecentUpdate = myInputHistory ? myInputHistory[myInputHistory.length - 1].frame : 0;

      if (previousUpdate !== _this.mostRecentUpdate) {
        _this.receiveInput(myInputHistory[myInputHistory.length - 1].direction);
      }
    });
  }

  (0, _createClass2.default)(Player, [{
    key: "receiveInput",
    value: function receiveInput(dir) {
      var allowImediateOverride = _Types.DirectionsUtils.isDown(dir) && this.canMoveDown() && (_Types.DirectionsUtils.isUp(this.currentDirection) || this.notMoving()) || _Types.DirectionsUtils.isUp(dir) && this.canMoveUp() && (_Types.DirectionsUtils.isDown(this.currentDirection) || this.notMoving()) || _Types.DirectionsUtils.isLeft(dir) && this.canMoveLeft() && (_Types.DirectionsUtils.isRight(this.currentDirection) || this.notMoving()) || _Types.DirectionsUtils.isRight(dir) && this.canMoveRight() && (_Types.DirectionsUtils.isLeft(this.currentDirection) || this.notMoving());

      if (allowImediateOverride) {
        this.currentDirection = dir;
        this.nextDirection = _Types.Directions.NONE;
        return;
      }

      var allowQueueDirection = _Types.DirectionsUtils.isDown(dir) && _Types.DirectionsUtils.isDown(this.targetCellType()) || _Types.DirectionsUtils.isUp(dir) && _Types.DirectionsUtils.isUp(this.targetCellType()) || _Types.DirectionsUtils.isRight(dir) && _Types.DirectionsUtils.isRight(this.targetCellType()) || _Types.DirectionsUtils.isLeft(dir) && _Types.DirectionsUtils.isLeft(this.targetCellType());

      if (allowQueueDirection) {
        this.nextDirection = dir;
      }
    }
  }]);
  return Player;
}();

exports.Player = Player;