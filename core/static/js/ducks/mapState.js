"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAppDimensions = exports.refreshMap = exports.mapStateReducer = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ReduxTypes = require("../Types/ReduxTypes");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var initialState = {
  mapCells: [],
  appDimensions: {
    canvasHeight: 0,
    canvasWidth: 0
  },
  cellDimensions: {
    cellSize: 0,
    halfCellSize: 0
  }
};

var mapStateReducer = function mapStateReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _ReduxTypes.MapStateActionTypes.REFRESH_MAP:
      return _objectSpread(_objectSpread({}, state), {}, {
        mapCells: action.payload
      });

    case _ReduxTypes.MapStateActionTypes.UPDATE_APP_DIMENSIONS:
      return _objectSpread(_objectSpread({}, state), {}, {
        appDimensions: action.payload
      });

    case _ReduxTypes.MapStateActionTypes.UPDATE_CELL_DIMENSIONS:
      return _objectSpread(_objectSpread({}, state), {}, {
        cellDimensions: action.payload
      });

    default:
      return state;
  }
};

exports.mapStateReducer = mapStateReducer;

var refreshMap = function refreshMap(mapResponse) {
  return function (dispatch, getState) {
    dispatch({
      type: _ReduxTypes.MapStateActionTypes.REFRESH_MAP,
      payload: mapResponse
    });
    dispatch({
      type: _ReduxTypes.MapStateActionTypes.UPDATE_CELL_DIMENSIONS,
      payload: generateCellDimensions(mapResponse, getState().appDimensions)
    });
  };
};

exports.refreshMap = refreshMap;

var updateAppDimensions = function updateAppDimensions(width, height) {
  return function (dispatch, getState) {
    dispatch({
      type: _ReduxTypes.MapStateActionTypes.UPDATE_APP_DIMENSIONS,
      payload: {
        canvasHeight: height,
        canvasWidth: width
      }
    });

    if (getState().mapCells.length > 0) {
      dispatch({
        type: _ReduxTypes.MapStateActionTypes.UPDATE_CELL_DIMENSIONS,
        payload: generateCellDimensions(getState().mapCells, {
          canvasHeight: height,
          canvasWidth: width
        })
      });
    }
  };
};

exports.updateAppDimensions = updateAppDimensions;

var generateCellDimensions = function generateCellDimensions(data, appDimensions) {
  var size = Math.min((appDimensions.canvasWidth - 1) / Math.max.apply(Math, (0, _toConsumableArray2.default)(data.map(function (r) {
    return r.length;
  }))), (appDimensions.canvasHeight - 1) / data.length);
  return {
    cellSize: size,
    halfCellSize: size * 0.5
  };
};