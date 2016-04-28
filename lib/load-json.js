const fs = require('fs');

module.exports = function(filename, done) {
  if (filename === '-') {
    filename = '/dev/stdin';
  }
  fs.readFile(filename, {encoding: 'utf8'}, function(error, buffer) {
    if (error) {
      return done(error);
    }
    var json;
    try {
      json = JSON.parse(buffer.toString());
    } catch (error) {
      return done(error);
    }
    return done(null, json);
  });
};
