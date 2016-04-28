#!/usr/bin/env node
var optimist = require('optimist')
  .usage('$0 [options] [input] [-o output]')
  .wrap(80)
  .options('projection', {
    describe: 'The d3.geo projection to use (use "null" or -C for cartesian)',
    default: 'mercator'
  })
  .options('cartesian', {
    describe: 'Assume Cartesian coordinates (no geographic projection)',
    alias: 'C'
  })
  .options('layers', {
    describe: 'A comma-separated list of keys to whitelist from topology.objects',
    default: null
  })
  .options('feature-filter', {
    describe: 'Filter features by this dot or fat arrow expression',
    alias: 'ff'
  })
  .options('only-features', {
    describe: 'Only include the features with these comma-separated IDs',
    alias: 'of'
  })
  .options('exclude-features', {
    describe: 'Exclude the features with these comma-separated IDs',
    alias: 'ef'
  })
  .options('mesh', {
    describe: 'Include mesh (connected outline) layers for comma-separated IDs, or "*"',
    alias: 'm'
  })
  .options('style', {
    describe: 'Include (literal) CSS styles in your SVG. To import a URL, use --style "@import url(style.css);"',
    alias: 'css'
  })
  .options('zoom', {
    describe: 'The layer or feature id to zoom to',
    alias: 'z'
  })
  .options('id', {
    describe: 'The feature ID accessor (dotmap or fat arrow expression)',
    default: 'id'
  })
  .options('properties', {
    describe: 'A comma-separated list of feature properties to convert to data attributes, or "*" (or as a boolean flag)',
    default: null
  })
  .options('bounds', {
    describe: 'The geographic bounds to zoom to, in the form "west north east south"',
    alias: 'b'
  })
  .options('viewbox', {
    describe: 'The SVG viewBox, in the form "left top width height" (projected pixels)',
    alias: 'V'
  })
  .options('o', {
    describe: 'Write the resulting SVG to this file (otherwise, write to stdout)'
  })
  .options('h', {
    describe: 'Show this helpful message',
    alias: 'help'
  })
  .check(function(argv) {
    if (argv.zoom && (argv.bounds || argv.viewbox)) {
      throw new Error('--zoom is incompatible with --bounds and --viewbox');
    } else if (argv.bounds && argv.viewbox) {
      throw new Error('--bounds is incompatible with --viewbox');
    }

    if (argv.ff && argv.of) {
      throw new Error('--feature-filter is incompatible with --only-features');
    } else if (argv.ff && argv.ef) {
      throw new Error('--feature-filter is incompatible with --exclude-features');
    } else if (argv.of && argv.ef) {
      throw new Error('--only-features and --exclude-fearues are incompatible');
    }

    if (argv.projection && argv.cartesian) {
      console.warn('--cartesian negates --projection; assuming Cartesian coordinates');
    }

    if (argv._.length > 1) {
      throw new Error('Only one TopoJSON topology is allowed (for now)');
    }
  });

var argv = optimist.argv;

if (argv.help) {
  return optimist.showHelp();
}

const async = require('async');
const vectorize = require('../');
const loadJSON = require('../lib/load-json');
const writeSVG = require('../lib/write-svg');

const parseNumberList = function(str) {
  return str.split(' ').map(Number);
};

if (argv.bounds) {
  argv.bounds = parseNumberList(argv.bounds);
} else if (argv.viewbox) {
  argv.viewBox = parseNumberList(argv.viewbox);
}

var featureIds;
if (argv.ff) {
  argv.featureFilter = argv.ff;
} else if (argv['only-features']) {
  featureIds = argv['only-features'].split(',');
  argv.featureFilter = function(d) {
    return featureIds.indexOf(d.id) > -1;
  };
} else if (argv['exclude-features']) {
  featureIds = argv['exclude-features'].split(',');
  argv.featureFilter = function(d) {
    return featureIds.indexOf(d.id) === -1;
  };
}

async.waterfall([
  function read(next) {
    loadJSON(argv._[0] || '-', next);
  },
  function render(topology, next) {
    vectorize(topology, argv, next);
  },
  function write(svg, next) {
    var out = argv.o || argv._[1];
    // console.warn('writing', out || 'to stdout');
    out = out ? fs.createWriteStream(out) : process.stdout;
    writeSVG(svg, out, next);
  }
], function(error) {
  if (error) {
    console.error(error);
  }
});
