"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMapUsingRandomDFS = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Stack = _interopRequireDefault(require("./Stack"));

var _CoordPair = require("./CoordPair");

var _directions = _interopRequireDefault(require("./directions"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var generateMapUsingRandomDFS = function generateMapUsingRandomDFS() {
  var startingLocation = _objectSpread({}, _CoordPair.zeroPair);

  var dimensions = {
    x: 10,
    y: 10
  };

  var _emptyMap = emptyMap(dimensions),
      mapDirections = _emptyMap.mapDirections,
      visited = _emptyMap.visited;

  var stack = new _Stack.default();
  return mapDirections;
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
            if (!(i < dimensions.x)) {
              _context2.next = 9;
              break;
            }

            _context2.next = 6;
            return Array.from(emptyRow(dimensions.y));

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
    mapDirections: Array.from(fillEmptyMap(_directions.default.NONE)),
    visited: Array.from(fillEmptyMap(false))
  };
};