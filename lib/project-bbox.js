module.exports = function(bbox, proj) {
  return [
    proj([bbox[0], bbox[1]]),
    proj([bbox[2], bbox[3]])
  ];
};
