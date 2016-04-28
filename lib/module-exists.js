const path = require('path');
const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

module.exports = function exists(name) {
  if (name.charAt(0) === '.') {
    name = path.join(process.cwd(), name);
  }
  try {
    require(name);
  } catch (err) {
    if (err.code === MODULE_NOT_FOUND) {
      return false;
    }
  }
  return name;
};
