const jsdom = require('jsdom');
const d3 = require('d3');

module.exports = function svgify(callback, done) {
  jsdom.env('<svg></svg>', function(errors, window) {
    if (errors) {
      return done(errors[0]);
    }

    var svg = d3.select(window.document.querySelector('svg'))
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('version', '1.2');

    if (callback.length > 1) {
      callback.call(window, svg, done);
    } else {
      callback.call(window, svg);
      done(null, svg);
    }
  });
};
