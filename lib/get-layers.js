const fof = require('fof');
const topojson = require('topojson');

module.exports = function(topology, options) {
  var keys = Object.keys(topology.objects);

  // --layers foo,bar
  if (options.layers) {
    keys = String(options.layers).split(',');
  }

  // --features 'd => d.properties.state === "CA"'
  var featureFilter = options.featureFilter
    ? fof(options.featureFilter)
    : undefined;

  var layers = keys.map(function(key) {
    var layer = topojson.feature(topology, topology.objects[key]);
    layer.id = key;
    if (layer.features) {
      if (featureFilter) {
        layer.features = layer.features.filter(function(feature) {
          return featureFilter.call(layer, feature);
        });
      }
    } else {
      // coerce to a FeatureCollection if it's not one
      layer = {
        id: key,
        type: 'FeatureCollection',
        features: [layer]
      };
    }
    return layer;
  });

  if (featureFilter) {
    // if there's a feature filter, discard any layers that have no features
    layers = layers.filter(function(layer) {
      return layer.features.length > 0;
    });
  }

  return layers;
};
