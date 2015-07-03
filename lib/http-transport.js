'use sctrict';

var http = require('http');

function HttpTransport() {}

HttpTransport.prototype.listen = function(opts, callback) {
  callback = callback || function() {};

  var self = this;
  var server = http.createServer(handleRequest.bind(this));

  server.listen(opts.port || 3000, opts.hostname || "0.0.0.0", function() {
    callback(null, server.address());
  });
};

function handleRequest(req, res) {
  var self = this;
  var data = '';

  // if request is type POST and on /exec url then parse the data and handle it
  if (req.url.indexOf('/exec') !== -1 && req.method.toLowerCase() === 'post' ) {
    req.on('data', function(chunk) {
      chunk = chunk.toString();
      data += chunk;
    });

    return req.on('end', function() {
      var args = JSON.parse(data);
      self.exec(args, function(err, out) {
        if (err) {
          // ignore error for now...
        }

        // empty 200 OK response for now
        res.writeHead(200, "OK", {'Content-Type': 'application/json'});
        res.end(JSON.stringify(out));
      });
    });
  }

  // default action for the rest of requests
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ message: 'To call an action use /do' }));
}

HttpTransport.prototype.send = function(opts, args, callback) {
  args = args || {};
  var data = '';
  var reqOpts = _.clone(opts, true);
  reqOpts = _.extend(self._defaults.transport, reqOpts);

  var req = http.request(reqOpts, function(res) {
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      callback(null, JSON.parse(data));
    });
    res.on('error', function(err) {
      callback(err);
    });
  });

  req.on('error', function(err) {
    console.log('request error', err);
  });

  req.write(JSON.stringify(args));
  req.end();
};

module.exports = HttpTransport;
