// Define URL for earthquake data
const earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Define URL for tectonic plates data
const platesUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

// Log a message to verify that the script is working
console.log("its working");

// Define basemap layers
const basemaps = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }),
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
    })
};

// Create a Leaflet map with specified center and zoom level
const map = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 3,
    layers: [basemaps.OpenStreetMap] // Set default base map
});

// Create overlay groups for earthquake and tectonic plates data
const overlays = {
    "Earthquakes": L.layerGroup(),
    "Tectonic Plates": L.layerGroup()
};

// Add layer controls to the map
L.control.layers(basemaps, overlays).addTo(map);

// Function to fetch and plot earthquake data
async function fetchAndPlotEarthquakeData() {
    const response = await fetch(earthquakeUrl);
    const data = await response.json();

    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: magColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }).addTo(overlays.Earthquakes); // Add earthquake data to the overlay group
}

// Function to fetch and plot tectonic plates data
async function fetchAndPlotTectonicPlatesData() {
    const response = await fetch(platesUrl);
    const data = await response.json();

    L.geoJSON(data, {
        style: function (feature) {
            return {
                color: "orange", // Set color for tectonic plates
                weight: 2
            };
        }
    }).addTo(overlays["Tectonic Plates"]); // Add tectonic plates data to the overlay group
}

// Fetch and plot earthquake data
fetchAndPlotEarthquakeData();

// Fetch and plot tectonic plates data
fetchAndPlotTectonicPlatesData();

// Function to calculate marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// Function to determine color based on earthquake magnitude
function magColor(magnitude) {
    return magnitude > 5 ? '#f06b6b' :
        magnitude > 4 ? '#f0936b' :
        magnitude > 3 ? '#f3ba4e' :
        magnitude > 2 ? '#f3db4c' :
        magnitude > 1 ? '#e1f34c' :
            '#b7f34d';
}
