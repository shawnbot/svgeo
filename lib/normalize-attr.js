module.exports = function normalizeAttributeName(name) {
  return name.toLowerCase().replace(/\W+/g, '-');
};
