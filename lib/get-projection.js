const d3 = require('d3');
// FIXME: do we need the extended projections here?
const defaultProjection = 'mercator';
const moduleExists = require('./module-exists');

module.exports = function getPath(options) {
  var projection = options.projection;
  if (projection === 'null' || projection === null) {
    return null;
  } else if (!projection) {
    projection = defaultProjection;
  } else if (typeof projection === 'string') {
    var path;
    if (path = moduleExists(projection)) {
      projection = require(path);
    } else {
      // console.warn('assuming built-in projection:', projection);
    }
  }
  return (typeof projection === 'function')
    ? projection
    : d3.geo[projection]();
};
