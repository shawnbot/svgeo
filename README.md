# svgeo

This is a Node.js module and command line tool for converting [TopoJSON] into
semantic SVG. The resulting SVG contains `<g>` elements for each layer
("object") in the topology, and one for each feature in each layer. Layers can
be selected by name (and re-ordered), and features can be filtered with
[fof]-compatible expressions. For example:

```sh
# assuming we've installed topojson and found a Shapefile of US states...
topojson states=path/to/states.shp > states.json

# isolate features by id with --only-features
svgeo --only-features CA,OR,WA --zoom auto states.json > west-coast.svg

# exclude features by id with --exclude-features
svgeo --exclude-features AS,GU,PR --zoom auto states.json > no-territories.svg
```

## Installation

```
npm install [-g] svgeo
```

## Command Line

```
svgeo [options] [input] [-o output]

Options:
  --projection              The d3.geo projection to use (use "null" or -C for
                            cartesian)                     [default: "mercator"]
  --cartesian, -C           Assume Cartesian coordinates (no geographic
                            projection)                                         
  --layers                  A comma-separated list of keys to whitelist from
                            topology.objects                     [default: null]
  --feature-filter, --ff    Filter features by this dot or fat arrow expression
                                                                                
  --only-features, --of     Only include the features with these
                            comma-separated IDs                                 
  --exclude-features, --ef  Exclude the features with these comma-separated IDs
                                                                                
  --zoom, -z                The layer or feature id to zoom to                  
  --id                      The feature ID accessor (dotmap or fat arrow
                            expression)                          [default: "id"]
  --properties              A comma-separated list of feature properties to
                            convert to data attributes, or "*" (or as a boolean
                            flag)                                [default: null]
  --bounds, -b              The geographic bounds to zoom to, in the form "west
                            north east south"                                   
  --viewbox, -V             The SVG viewBox, in the form "left top width
                            height" (projected pixels)                          
  -o                        Write the resulting SVG to this file (otherwise,
                            write to stdout)                                    
  -h, --help                Show this helpful message                           

```

## API

Coming soon!

[TopoJSON]: https://github.com/mbostock/topojson
[fof]: https://github.com/shawnbot/fof
