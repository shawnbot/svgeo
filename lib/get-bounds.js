module.exports = function(layers, path, options) {

  var id = options.zoom;
  if (id === 'auto') {
    var features = layers.reduce(function(list, layer) {
      return list.concat(layer.features);
    }, []);
    var bounds = [[Infinity, Infinity], [-Infinity, -Infinity]];
    features.forEach(function(feature) {
      var b = path.bounds(feature);
      if (b[0][0] < bounds[0][0]) bounds[0][0] = b[0][0];
      if (b[0][1] < bounds[0][1]) bounds[0][1] = b[0][1];
      if (b[1][0] > bounds[1][0]) bounds[1][0] = b[1][0];
      if (b[1][1] > bounds[1][1]) bounds[1][1] = b[1][1];
    });
    return bounds;
  } else {
    var feature;
    var j = 0;
    // FIXME: make this work for a list of IDs?
    layers.forEach(function(layer, i) {
      if (layer.id === id || id === ('layer@' + i)) {
        feature = layer;
      } else {
        layer.features.forEach(function(f) {
          if (f.id === id || id === ('feature@' + j)) {
            feature = f;
          }
          j++;
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
