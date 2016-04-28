module.exports = function(layers, path, options) {

  var id = options.zoom;
  if (id) {
    var feature;
    var j = 0;
    layers.forEach(function(layer, i) {
      if (layer.id === id || id === ('layer@' + i)) {
        feature = layer;
      } else {
        layer.features.forEach(function(f) {
          if (f.id === id || id === ('feature@' + j++)) {
            feature = f;
          }
        });
      }
    });

    if (feature) {
      return path.bounds(feature);
    } else {
      console.warn('no such viewBox object ID:', id);
    }
  }
};
