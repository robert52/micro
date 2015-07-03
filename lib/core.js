'user strict';

var _ = require("lodash");
var patrun = require("patrun");

function Core() {
  this._localpat = patrun();
  this._remotepat = patrun();
}

Core.prototype.define = function(pattern, callback) {
  this._localpat.add(pattern, callback);
};

Core.prototype.find = function(pattern) {
  var fn = this._localpat(args);

  if (!fn) {
    fn = this._remotepat.find(args);
  }

  return fn;
};

/*
 * Execute an action based on a pattern
 */
Core.prototype.exec = function(args, callback) {
  var fn = this.find(args);

  if (fn) fn(args, callback);
};

/*
 * Define a client for a pattern and make calls to it
 */
Core.prototype.client = function(opts, pattern) {
  var self = this;

  this._remotepat.add(pattern, function(args, callback) {
    self.send(opts, args, callback);
  });
};

/*
 * Use a service
 *
 * for now just local
 * use .client() to define a remote service
 */
Core.prototype.use = function(service) {
  var self = this;
  var local = _.clone(service._localpat.list());
  var remote = _.clone(service._remotepat.list());

  _.forEach(local, function(p) {
    self._localpat.add(p.match, p.data);
  });

  _.forEach(remote, function(p) {
    self._remotepat.add(p.match, p.data);
  });
};

module.exports = Core;
