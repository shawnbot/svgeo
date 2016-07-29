module.exports = function(bbox, proj) {
  // console.warn('projecting:', bbox);
  return [
    proj([bbox[0], bbox[1]]),
    proj([bbox[2], bbox[3]])
  ];
};
