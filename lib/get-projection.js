const d3 = require('d3');
// FIXME: do we need the extended projections here?
const defaultProjection = 'mercator';
const relative = require('require-relative');

module.exports = function getPath(options) {
  var projection = options.projection;
  if (projection === 'null' || projection === null) {
    return null;
  } else if (typeof projection === 'string') {
    try {
      return relative(projection, process.cwd());
    } catch (error) {
      console.warn('no such module:', projection, error);
      projection = defaultProjection;
    }
  }
  return (typeof projection === 'function')
    ? projection
    : d3.geo[projection || defaultProjection]();
};
