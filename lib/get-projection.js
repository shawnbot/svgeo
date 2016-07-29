const d3 = require('d3');
// FIXME: do we need the extended projections here?
const defaultProjection = 'mercator';
const relative = require('require-relative');

module.exports = function getPath(options) {
  var projection = options.projection;
  if (projection === 'null' || projection === null) {
    return null;
  } else if (typeof projection === 'string') {
    var name = projection;
    projection = relative(projection, process.cwd());
    if (typeof projection === 'function') {
      projection = projection();
    } else {
      throw new Error('projection "' + name + '" does not export a function');
    }
  }
  return (typeof projection === 'function')
    ? projection
    : d3.geo[projection || defaultProjection]();
};
