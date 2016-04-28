const os = require('os');
const prolog = '<?xml version="1.0" standalone="yes"?>' + os.EOL;

module.exports = function write(selection, stream, done) {
  var svg = selection.property('outerHTML');
  stream.write(prolog);
  stream.write(svg);
  if (stream !== process.stdout) {
    stream.end();
  }
  done();
};
