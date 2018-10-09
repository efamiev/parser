'use strict';

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _avitoHandler = require('./handlers/avitoHandler');

var _avitoHandler2 = _interopRequireDefault(_avitoHandler);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var avitoRequest = function avitoRequest() {
  return (0, _request2.default)({
    url: _constants.avitoUrl,
    proxy: _constants.proxy
  }, _avitoHandler2.default);
};

avitoRequest();

setInterval(avitoRequest, _constants.fiveMinuteInterval);