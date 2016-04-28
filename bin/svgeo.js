#!/usr/bin/env node
var optimist = require('optimist')
  .options('id', {
    describe: 'the feature id accessor (dotmap or fat arrow expression)',
    default: 'id'
  })
  .options('projection', {
    describe: 'the d3.geo projection to use (use "null" or -C for cartesian)',
    default: 'mercator'
  })
  .options('cartesian', {
    describe: 'Assume Cartesian coordinates (no geographic projection)',
    alias: 'C',
    boolean: true
  })
  .options('layers', {
    describe: 'a comma-separated list of keys to whitelist from topology.objects',
    default: null
  })
  .options('zoom', {
    describe: 'the layer or feature id to zoom to',
    alias: 'z'
  })
  .options('bounds', {
    describe: 'the geographic bounds to zoom to, in the form "west north east south"',
    alias: 'b'
  })
  .options('viewbox', {
    describe: 'the SVG viewBox, in the form "left top width height" (projected pixels)'
  })
  .options('o', {
    describe: 'write the resulting SVG to this file (otherwise, write to stdout)'
  })
  .check(function(argv) {
    if (argv.zoom && (argv.bounds || argv.viewbox)) {
      throw new Error('--zoom is incompatible with --bounds and --viewbox');
    } else if (argv.bounds && argv.viewbox) {
      throw new Error('--bounds is incompatible with --viewbox');
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
