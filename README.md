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

You can also generate meshes (connected outlines) of all or individual layers,
which makes styling borders much nicer. If you've ever been frustrated with the
jaggies that result from putting a stroke on two abutting features, then this
is for you.

```sh
svgeo --mesh -- states.json > states.svg
```

### Great, now what do I do with these SVGs?
I'm glad you asked. Debugging TopoJSON can be tricky; `svgeo` might just be a
handy tool for ensuring that your topologies look the way you expect them to.
But you can also use the resulting SVGs as web assets, either with regular
old `<img>` tags:

```html
<img src="states.svg">
```

or, if you want to get fancy, the [SVG `<use>` element][use] lets you
selectively import elements by ID and style them individually:

```html
<svg viewBox="0 0 850 500">
  <use fill="#eee" xlink:href="states.svg#states"/>
  <use fill="#def" xlink:href="states.svg#CA"/>
  <use stroke="#000" xlink:href="states.svg#states-mesh"/>
</svg>
```

You can also add styles to the SVG document with `--style`, which takes
a CSS string like `'.feature { fill: #eee; } .mesh { stroke: #000; }'`.
You can reference an external CSS file with `--style '@import url("path/to/style.css")'`.

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
                                                                                
  --mesh, -m                Include mesh (connected outline) layers for
                            comma-separated IDs, or "*"                         
  --style, --css            Include (literal) CSS styles in your SVG. To import
                            a URL, use --style "@import url(style.css);"        
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
[use]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use
