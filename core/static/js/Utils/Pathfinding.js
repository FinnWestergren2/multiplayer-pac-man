"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BFS = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _Game = require("../Game");

var _CoordPair = require("../Types/CoordPair");

var _Directions = require("../Types/Directions");

var BFS = function BFS(startFloat, endCell) {
  var startCell = _CoordPair.CoordPairUtils.roundedPair(startFloat);

  if (_CoordPair.CoordPairUtils.equalPairs(startCell, endCell)) {
    return [startCell];
  }

  var queue = [startCell];
  var popIndex = 0;

  var mapCells = _Game.mapStore.getState().mapCells.map(function (row) {
    return row.map(function (col) {
      return {
        dir: col,
        isVisited: false,
        parentCell: {
          x: -1,
          y: -1
        },
        depth: 0
      };
    });
  });

  mapCells[startCell.y][startCell.x].isVisited = true;

  var getAllBranches = function getAllBranches(location) {
    var branches = [];
    var x = Math.floor(location.x);
    var y = Math.floor(location.y);
    var directions = mapCells[y][x].dir;

    if (mapCells[y + 1] && mapCells[y + 1][x] && _Directions.DirectionsUtils.isDown(directions) && !mapCells[y + 1][x].isVisited) {
      branches.push({
        x: x,
        y: y + 1
      });
      mapCells[y + 1][x].isVisited = true;
      mapCells[y + 1][x].parentCell = location;
    }

    if (mapCells[y - 1] && mapCells[y - 1][x] && _Directions.DirectionsUtils.isUp(directions) && !mapCells[y - 1][x].isVisited) {
      branches.push({
        x: x,
        y: y - 1
      });
      mapCells[y - 1][x].isVisited = true;
      mapCells[y - 1][x].parentCell = location;
    }

    if (mapCells[y] && mapCells[y][x + 1] && _Directions.DirectionsUtils.isRight(directions) && !mapCells[y][x + 1].isVisited) {
      branches.push({
        x: x + 1,
        y: y
      });
      mapCells[y][x + 1].isVisited = true;
      mapCells[y][x + 1].parentCell = location;
    }

    if (mapCells[y] && mapCells[y][x - 1] && _Directions.DirectionsUtils.isLeft(directions) && !mapCells[y][x - 1].isVisited) {
      branches.push({
        x: x - 1,
        y: y
      });
      mapCells[y][x - 1].isVisited = true;
      mapCells[y][x - 1].parentCell = location;
    }

    return branches;
  };

  while (true) {
    if (popIndex >= queue.length) {
      return [];
    }

    var branches = getAllBranches(queue[popIndex]);

    if (branches.some(function (b) {
      return _CoordPair.CoordPairUtils.equalPairs(b, endCell);
    })) {
      break;
    }

    queue = [].concat((0, _toConsumableArray2.default)(queue), (0, _toConsumableArray2.default)(branches));
    popIndex++;
  } // we reverse the list at the end


  var output = [endCell];

  while (!_CoordPair.CoordPairUtils.equalPairs(output[output.length - 1], startCell)) {
    var currentCell = output[output.length - 1];
    output = [].concat((0, _toConsumableArray2.default)(output), [mapCells[currentCell.y][currentCell.x].parentCell]);
  }

  output = output.reverse();

  if (output.length > 1) {
    var firstDir = _CoordPair.CoordPairUtils.getDirection(startFloat, output[0]);

    var secondDir = _CoordPair.CoordPairUtils.getDirection(startFloat, output[1]);

    if (_Directions.DirectionsUtils.getOpposite(firstDir) === secondDir) {
      output = output.slice(1);
    }
  }

  return output;
};

exports.BFS = BFS;