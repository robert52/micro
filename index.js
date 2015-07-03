'use strict';

var _ = require('lodash');
var Core = require('./lib/core');
var HttpTransport = require('./lib/http-transport');

function Micro(opts) {
  this.defaults = {
    transport: {
      port: 3000,
      hostname: "localhost",
      method: "POST",
      path: '/exec',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  };

  this.config = _.extend({}, this.defaults, opts);

  Core.call(this);
  HttpTransport.call(this);
}

_.extend(Micro.prototype, HttpTransport.prototype, Core.prototype);

module.exports = function build(opts) {
  return new Micro(opts);
};
