"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMapUsingRandomDFS = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Stack = _interopRequireDefault(require("./Stack"));

var _shared = require("shared");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var generateMapUsingRandomDFS = function generateMapUsingRandomDFS(playerIds) {
  var dimensions = {
    x: 7,
    y: 7
  };
  var stack = new _Stack.default();

  var start = _shared.CoordPairUtils.randomPair(dimensions);

  var _emptyMap = emptyMap(dimensions),
      mapDirections = _emptyMap.mapDirections,
      visited = _emptyMap.visited;

  var withinDimensions = function withinDimensions(cell) {
    return cell.x >= 0 && cell.y >= 0 && cell.x < dimensions.x && cell.y < dimensions.y;
  };

  var deepestNode = {
    depth: 0,
    cell: start
  };

  var push = function push(cell) {
    stack.push(cell);
    visited[cell.y][cell.x] = true;

    if (deepestNode.depth < stack.size()) {
      deepestNode = {
        depth: stack.size(),
        cell: cell
      };
    }
  };

  push(start);

  while (!stack.isEmpty()) {
    var currentCell = stack.peek();

    var firstDir = _shared.DirectionsUtils.randomSingleDirection();

    var dir = firstDir;

    var nextCell = _objectSpread({}, currentCell);

    var i = 0;

    while (i < 4 && (!withinDimensions(nextCell) || visited[nextCell.y][nextCell.x])) {
      dir = _shared.DirectionsUtils.rotateClockwise(dir);
      nextCell = getAdjacentCell(currentCell, dir);
      i++;
    }

    if (i === 4 || !withinDimensions(nextCell) || visited[nextCell.y][nextCell.x]) {
      // we've exhausted all options
      stack.pop();
      continue;
    }

    destroyWall(currentCell, dir, mapDirections);
    push(nextCell);
  }

  var startLocations = maxDistPair(mapDirections, deepestNode.cell, playerIds);
  return {
    map: mapDirections,
    startLocations: startLocations
  };
};

exports.generateMapUsingRandomDFS = generateMapUsingRandomDFS;

var emptyMap = function emptyMap(dimensions) {
  var _marked2 = /*#__PURE__*/_regenerator.default.mark(fillEmptyMap);

  function fillEmptyMap(withWhat) {
    var _marked, emptyRow, i;

    return _regenerator.default.wrap(function fillEmptyMap$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            emptyRow = function _emptyRow(length) {
              var j;
              return _regenerator.default.wrap(function emptyRow$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      j = 0;

                    case 1:
                      if (!(j < length)) {
                        _context.next = 7;
                        break;
                      }

                      _context.next = 4;
                      return withWhat;

                    case 4:
                      j++;
                      _context.next = 1;
                      break;

                    case 7:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _marked);
            };

            _marked = /*#__PURE__*/_regenerator.default.mark(emptyRow);
            i = 0;

          case 3:
            if (!(i < dimensions.y)) {
              _context2.next = 9;
              break;
            }

            _context2.next = 6;
            return Array.from(emptyRow(dimensions.x));

          case 6:
            i++;
            _context2.next = 3;
            break;

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _marked2);
  }

  return {
    mapDirections: Array.from(fillEmptyMap(_shared.Directions.NONE)),
    visited: Array.from(fillEmptyMap(false))
  };
};

var getAdjacentCell = function getAdjacentCell(current, dir) {
  switch (dir) {
    case _shared.Directions.UP:
      return _objectSpread(_objectSpread({}, current), {}, {
        y: current.y - 1
      });

    case _shared.Directions.DOWN:
      return _objectSpread(_objectSpread({}, current), {}, {
        y: current.y + 1
      });

    case _shared.Directions.LEFT:
      return _objectSpread(_objectSpread({}, current), {}, {
        x: current.x - 1
      });

    case _shared.Directions.RIGHT:
      return _objectSpread(_objectSpread({}, current), {}, {
        x: current.x + 1
      });

    default:
      return current;
  }
};

var destroyWall = function destroyWall(cellA, dir, mapDirections) {
  var cellB = getAdjacentCell(cellA, dir);
  mapDirections[cellA.y][cellA.x] = dir | mapDirections[cellA.y][cellA.x];
  mapDirections[cellB.y][cellB.x] = _shared.DirectionsUtils.getOpposite(dir) | mapDirections[cellB.y][cellB.x];
};

var maxDistPair = function maxDistPair(mapDirections, deepestCell, playerIds) {
  var _ref;

  var cellA = _objectSpread({}, deepestCell);

  var cellB = findFarthest(cellA, mapDirections);

  while (true) {
    var cellANext = findFarthest(cellB, mapDirections);
    var cellBNext = findFarthest(cellANext, mapDirections);

    if (_shared.CoordPairUtils.equalPairs(cellA, cellANext) && _shared.CoordPairUtils.equalPairs(cellB, cellBNext)) {
      break;
    }

    cellA = _objectSpread({}, cellANext);
    cellB = _objectSpread({}, cellBNext);
  }

  return _ref = {}, (0, _defineProperty2.default)(_ref, playerIds[0], {
    location: cellA,
    direction: _shared.Directions.NONE
  }), (0, _defineProperty2.default)(_ref, playerIds[1], {
    location: cellB,
    direction: _shared.Directions.NONE
  }), _ref;
};

var findFarthest = function findFarthest(start, mapDirections) {
  var stack = new _Stack.default();
  var dimensions = {
    y: mapDirections.length,
    x: mapDirections[0].length
  };

  var canMove = function canMove(cell, dir) {
    return dir === (mapDirections[cell.y][cell.x] & dir);
  };

  var visited = emptyMap(dimensions).visited;
  var deepestNode = {
    depth: 0,
    cell: start
  };

  var push = function push(cell) {
    stack.push(cell);
    visited[cell.y][cell.x] = true;

    if (deepestNode.depth < stack.size()) {
      deepestNode = {
        depth: stack.size(),
        cell: cell
      };
    }
  };

  push(start);

  var _loop = function _loop() {
    var currentCell = stack.peek();

    var firstDir = _shared.DirectionsUtils.randomSingleDirection();

    var dir = firstDir;

    var nextCell = function nextCell() {
      return getAdjacentCell(currentCell, dir);
    };

    var i = 0;

    while (i < 4 && (!canMove(currentCell, dir) || visited[nextCell().y][nextCell().x])) {
      dir = _shared.DirectionsUtils.rotateClockwise(dir);
      i++;
    }

    if (!canMove(currentCell, dir) || visited[nextCell().y][nextCell().x]) {
      // we've exhausted all options
      stack.pop();
      return "continue";
    }

    push(nextCell());
  };

  while (!stack.isEmpty()) {
    var _ret = _loop();

    if (_ret === "continue") continue;
  }

  return deepestNode.cell;
};