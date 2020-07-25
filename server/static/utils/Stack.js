"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

// There are probably libraries for this, but I wanted to do this myself for fun
var Stack = function Stack() {
  var _this = this;

  (0, _classCallCheck2.default)(this, Stack);
  (0, _defineProperty2.default)(this, "stack", []);
  (0, _defineProperty2.default)(this, "push", function (item) {
    _this.stack.push(item);
  });
  (0, _defineProperty2.default)(this, "size", function () {
    return _this.stack.length;
  });
  (0, _defineProperty2.default)(this, "pop", function () {
    if (_this.size() === 0) {
      throw new Error("no elements to pop");
    }

    var toReturn = _this.stack[_this.size() - 1];

    _this.stack = _this.stack.slice(0, _this.size() - 1);
    return toReturn;
  });
  (0, _defineProperty2.default)(this, "peek", function () {
    return _this.stack[_this.size() - 1];
  });
  (0, _defineProperty2.default)(this, "isEmpty", function () {
    return _this.size() === 0;
  });
};

exports.default = Stack;