var os = require('os');

module.exports = function write(selection, stream, done) {
  var svg = selection.property('outerHTML');
  stream.write('<?xml version="1.0" standalone="yes"?>' + os.EOL);
  stream.write(svg);
  if (stream !== process.stdout) {
    stream.end();
  }
  done();
};
