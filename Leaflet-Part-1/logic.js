// Define URL for earthquake data
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Log a message to verify that the script is working
console.log("its working");

// Define basemap layer using OpenStreetMap tiles
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
});

// Create a Leaflet map with specified center and zoom level
let map = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 3,
});

// Add basemap layer to the map
basemap.addTo(map);

// Load earthquake data using D3 and add GeoJSON layer to the map
d3.json(url).then(function(data) {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                // Adjust the size of the marker
                radius: markerSize(feature.properties.mag),
                fillColor: magColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }).addTo(map);

    // Define and add legend to the map
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            depths = [-10, 10, 30, 50, 70, 90],
            colors = ['#b7f34d', '#e1f34c', '#f3db4c', '#f3ba4e', '#f0936b', '#f06b6b'];

        // Loop through depths and generate legend HTML
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    // Add legend to the map
    legend.addTo(map);
});

// Function to calculate marker size based on earthquake magnitude
function markerSize(magnitude) {
    // Adjust the marker size to be smaller
    return Math.max(magnitude * 3, 3);
}

// Function to determine color based on earthquake magnitude
function magColor(magnitude) {
    // Define colors based on earthquake magnitude
    return magnitude > 5 ? '#f06b6b' :
        magnitude > 4 ? '#f0936b' :
        magnitude > 3 ? '#f3ba4e' :
        magnitude > 2 ? '#f3db4c' :
        magnitude > 1 ? '#e1f34c' :
            '#b7f34d';
}
