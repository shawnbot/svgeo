const d3 = require('d3');
const fof = require('fof');
const topojson = require('topojson');
const svgify = require('./lib/svgify');

const getProjection = require('./lib/get-projection');
const getLayers = require('./lib/get-layers');
const getBounds = require('./lib/get-bounds');
const projectBBox = require('./lib/project-bbox');
const normalizeAttributeName = require('./lib/normalize-attr');

module.exports = function(topology, options, done) {
  if (typeof topology !== 'object' || topology.type !== 'Topology') {
    throw new Error('invalid TopoJSON; expected {type: "Topology", ...}');
  }

  if (!options) {
    options = {};
  }

  var proj = getProjection(options);
  var layers = getLayers(topology, options);

  var id = options.id
    ? fof(options.id)
    : function(d) { return d.id };

  var path = d3.geo.path()
    .projection(proj);

  if (options.pointRadius) {
    path.pointRadius(typeof options.pointRadius === 'number'
      ? options.pointRadius
      : fof(options.pointRadius));
  }

  var viewBox = options.viewBox || options.viewbox;
  if (!viewBox) {
    var bounds = options.bounds;
    if (bounds) {
      if (bounds.length === 4) {
        bounds = [[bounds[0], bounds[1]], [bounds[2], bounds[3]]];
      }
    } else if (options.zoom) {
      bounds = getBounds(layers, path, options);
    } else if (topology.bbox) {
      bounds = projectBBox(topology.bbox, proj);
    }
  }

  svgify(function(svg) {

    var style = options.style;
    if (style) {
      // if style is just a filename, wrap it in an @import
      if (style.match(/\.css$/)) {
        style = '@import url("' + style + '");';
      }
      svg.append('style')
        .html('<![CDATA[ ' + options.style + ' ]]>');
    }

    if (options.width || options.height) {
      svg
        .attr('width', options.width)
        .attr('height', options.height);
    }

    if (viewBox) {
      svg.attr('viewBox', Array.isArray(viewBox)
        ? viewBox.join(' ')
        : viewBox);
    } else if (bounds && bounds[0] && bounds[1]) {
      // console.warn('bounds:', bounds);
      svg.attr('viewBox', [
        bounds[0][0],
        bounds[0][1],
        bounds[1][0] - bounds[0][0],
        bounds[1][1] - bounds[0][1]
      ].join(' '));
    }

    var root = svg;
    if (options.defs) {
      root = svg.append('defs');
    }

    var layer = root.selectAll('g.layer')
      .data(layers)
      .enter()
      .append('g')
        .attr('id', id)
        .attr('class', 'layer');

    var feature = layer.selectAll('g.feature')
      .data(function(layer) {
        return layer.features;
      })
      .enter()
      .append('g')
        .attr('id', id)
        .attr('class', function(d) {
          return ['feature', d.type].join(' ');
        });

    var properties = options.properties;
    var setProperty = function(prop, value) {
      this.setAttribute('data-' + normalizeAttributeName(prop), value);
    };
    if (properties === '*' || properties === true) {
      feature.each(function(d) {
        if (d.properties) {
          for (var prop in d.properties) {
            setProperty.call(this, prop, d.properties[prop]);
          }
        }
      });
    } else if (properties) {
      properties = properties.split(',');
      feature.each(function(d) {
        if (d.properties) {
          properties.forEach(function(prop) {
            setProperty.call(this, prop, d.properties[prop]);
          }, this);
        }
      });
    }

    var shape = feature.append('path')
      .attr('d', path);

    var inherit = options.inherit;
    if (inherit) {
      var props = inherit.split(',');
      inherit = props.map(p => p + ': inherit;').join(' ');
      shape.attr('style', inherit);
    }

    if (options.title) {
      var title = fof(options.title);
      shape.append('title')
        .text(title);
    }

    if (options.mesh) {
      var getMesh = function(d) {
        return d.mesh;
      };

      var meshes = layers
        .filter(getMesh)
        .map(getMesh);

      if (meshes.length) {
        root.selectAll('path.mesh')
          .data(meshes)
          .enter()
          .append('path')
            .attr('id', id)
            .attr('class', 'mesh LineString')
            .attr('fill', 'none')
            .attr('style', inherit ? inherit : null)
            .attr('d', path);
      }
    }

    root.selectAll('path')
      .attr('vector-effect', 'non-scaling-stroke');

  }, done);
};
