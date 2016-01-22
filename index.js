var turf = require('turf');
var fs = require('fs');
var flatten = require('geojson-flatten');
var turfPoint = require('turf-point');
var data = require('./namria.json');

//var data = fs.readFileSync('namria.geojson', 'utf-8');
console.log(data)
var cleaned = {
    'type' : 'FeatureCollection',
    'features': []
}

data.features.forEach(function(feature) {
    if (feature.geometry) {
	//console.log(flatten(feature));
	cleaned.features.push(flatten(feature)[0])
    }
});

//waterway = flatten(data);
//waterway = JSON.parse(flattened);

//console.log(cleaned);

for(var i=0; i<cleaned.features.length; i++){
    // Get channel length

    curvlength = turf.lineDistance(cleaned.features[i], 'kilometers')
    cleaned.features[i].properties.curvlength = curvlength;

    // get downstream lenght 
    var startPoint = turfPoint(cleaned.features[i].geometry.coordinates[0]);
    var endPoint = turfPoint(cleaned.features[i].geometry.coordinates[cleaned.features[i].geometry.coordinates.length - 1]);
    var distance = turf.distance(startPoint, endPoint, 'kilometers');
    cleaned.features[i].properties.distance = distance;

    // compute sinousity https://en.wikipedia.org/wiki/Sinuosity
    var sinousity = (curvlength / distance);
    cleaned.features[i].properties.sinousity = sinousity;
};


fs.writeFileSync('out_namria.geojson', JSON.stringify(cleaned));

console.log('saved out.geojson');
