function getGPAPopupColor(gpa) {
    if (gpa >= 0 && gpa <= 3.53) {
        return '#6347ff'; // Purple
    } else if (gpa >= 3.54 && gpa <= 3.60) {
        return '#5182e4'; // Blue
    } else if (gpa >= 3.61 && gpa <= 3.65) {
        return '#4db8b4'; // Teal
    } else if (gpa >= 3.65 && gpa <= 3.70) {
        return '#5ac995'; // Green
    } else if (gpa >= 3.71 && gpa <= 3.75) {
        return '#a5d978'; // Lime
    } else if (gpa >= 3.76 && gpa <= 3.80) {
        return 'Yellow'; // Yellow
    } else if (gpa >= 3.81 && gpa <= 3.85) {
        return 'Orange'; // Orange
    } else if (gpa >= 3.86 && gpa <= 3.90) {
        return 'Red'; // Red
    } else if (gpa >= 3.91 && gpa <= 3.95) {
        return 'Black'; // Black
    } else {
        return '#e100ff'; // Hot Pink (default for GPAs outside defined ranges)
    }
}



var currentOpenPopup = null;



function getLSATOutlineColor(lsat) {
    if (lsat >= 154 && lsat <= 160) {
        return 'yellow';
    } else if (lsat > 160 && lsat <= 165) {
        return 'orange';
    } else if (lsat > 165 && lsat <= 170) {
        return 'red';
    }
        else if (lsat > 170 && lsat <= 180) {
        return 'black';
        }
    }

function updateMap(mapFrom, mapTo) {
    var center = mapFrom.getCenter();
    var zoom = mapFrom.getZoom();
    mapTo.setView(center, zoom, { animate: false });
}

var map2010 = L.map('map2010').setView([39.8283, -98.5795], 4);
map2010.addControl(new L.Control.Fullscreen());
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map2010);

fetch('https://raw.githubusercontent.com/maxwhitehouse/Final-Project/main/ABAdata.geojson')
    .then(response => response.json())
    .then(data => {
        var circleMarkers2010 = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var gpa = feature.properties["2010GPA"];
                var lsat = feature.properties["2010LSAT"];

                var popupContent = "Name: " + feature.properties["Name"] + "<br>2010 GPA: " + gpa + "<br>2010 LSAT: " + lsat;

                var circleMarker = L.circleMarker(latlng, {
                    fillColor: getGPAPopupColor(gpa),
                    color: lsat !== undefined ? getLSATOutlineColor(lsat) : 'black',  // Check for undefined LSAT
                    weight: 2,  
                    fillOpacity: 0.8
                }).bindPopup(popupContent);
               
                var tooltipContent = "Name: " + feature.properties["Name"];
                circleMarker.bindTooltip(tooltipContent);
                circleMarker.on('click', function (event) {
                    var schoolName = feature.properties["Name"];
                    var correspondingMarker2022 = findMarkerOnMap(map2022, data2022, schoolName);
        
                    if (correspondingMarker2022) {
                        correspondingMarker2022.openPopup();
                    }
                });
        
                return circleMarker;
            }
        }).addTo(map2010);
    });

function findMarkerOnMap(map, data, identifier) {
    var foundMarker = null;

    map.eachLayer(function (layer) {
        if (layer instanceof L.CircleMarker && layer.feature.properties["Name"] === identifier) {
            foundMarker = layer;
        }
    });

    return foundMarker;
}

    map2010.on('moveend', function () {
        updateMap(map2010, map2022);
    });

    
  
var map2022 = L.map('map2022').setView([39.8283, -98.5795], 4);
map2022.addControl(new L.Control.Fullscreen());
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map2022);

fetch('https://raw.githubusercontent.com/maxwhitehouse/Final-Project/main/test2.geojson')
    .then(response => response.json())
    .then(data => {
        data2022 = data;

        var circleMarkers2022 = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var gpa = feature.properties["2022GPA"];
                var lsat = feature.properties["2022LSAT"];

                var popupContent = "Name: " + feature.properties["Name"] + "<br>2022 GPA: " + gpa + "<br>2022 LSAT: " + lsat;

                var circleMarker = L.circleMarker(latlng, {
                    fillColor: getGPAPopupColor(gpa),
                    color: lsat !== undefined ? getLSATOutlineColor(lsat) : 'black',  // Check for undefined LSAT
                    weight: 2, 
                    fillOpacity: 0.8
                }).bindPopup(popupContent);

           
                var tooltipContent = "Name: " + feature.properties["Name"];
                circleMarker.bindTooltip(tooltipContent);

                circleMarker.on('click', function (event) {
                    var schoolName = feature.properties["Name"];
                    var correspondingMarker2010 = findMarkerOnMap(map2010, data, schoolName);
        
                    if (correspondingMarker2010) {
                        correspondingMarker2010.openPopup();
                    }
                });
    
        
                return circleMarker;
            }
        }).addTo(map2022);
    });


    function findMarkerOnMap(map, data, identifier) {
        var foundMarker = null;
    
        map.eachLayer(function (layer) {
            if (layer instanceof L.CircleMarker && layer.feature.properties["Name"] === identifier) {
                foundMarker = layer;
            }
        });
    
        return foundMarker;
    }


    var legend1 = L.control({ position: 'bottomright' });

    legend1.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var grades = [160, 165, 170, 180];
        var colors = ['yellow', 'orange', 'red', 'black'];
    
        div.innerHTML = '<h4>LSAT (outline) Legend</h4>';
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + colors[i] + '; opacity: ' + (i === 0 ? 0.7 : 0.9) + '"></i> ' +
                (i === 0 ? '0' : grades[i - 1] + 1) + (grades[i] ? '&ndash;' + grades[i] : '+') + '<br>';
        }
    
        return div;
    };
    
    legend1.addTo(map2010);
    
    var legend2 = L.control({ position: 'bottomleft' });
    
    legend2.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var grades = [3.53, 3.60, 3.65, 3.70, 3.75, 3.80, 3.85, 3.90, 3.95];
        var colors = ['#6347ff', '#5182e4', '#4db8b4', '#5ac995', '#a5d978', '#ffe066', '#ff9f66', '#ff6347', '#000000'];
    
        div.innerHTML = '<h4>GPA Legend</h4>';
    
        for (var i = 0; i < grades.length; i++) {
            var start = i === 0 ? '0' : (grades[i - 1] + 0.01).toFixed(2);
            var end = grades[i] ? grades[i].toFixed(2) : '+';
    
            div.innerHTML +=
                '<i style="background: ' + colors[i] + '; opacity: ' + (i === 0 ? 0.7 : 0.9) + '"></i> ' +
                start + '&ndash;' + end + '<br>';
        }
    
        return div;
    };
    
    legend2.addTo(map2022);

    
    function addBasemapSwitcher(map) {
        var mapboxAccessToken = 'pk.eyJ1IjoibWF4d2hpdGVob3VzZSIsImEiOiJjbG9peW9nY3UxZTN5MnJvMWV2ZGVxZ3VqIn0.a8iEZsSCZA7IP7mtskj4TQ';

        var basemaps = {
            'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            'Stamen Terrain': L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
                    '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; ' +
                    '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }),       
            'Esri World Imagery': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }),
            'Custom Mapbox Style': L.tileLayer('https://api.mapbox.com/styles/v1/maxwhitehouse/clonh3vft003t01r7667peoxu/tiles/256/{z}/{x}/{y}@2x?access_token=' + mapboxAccessToken, {
                attribution: '@MaxWhitehouse'
            }),
            'Mapbox Satellite': L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
                attribution: 'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            }),
            'Mapbox Streets': L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                    'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            }),
            'Mapbox Dark': L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
                attribution: 'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            }),
            'MtbMap': L.tileLayer('http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS'
            }),
    
        };
    
        L.control.layers(basemaps).addTo(map);
      }
      addBasemapSwitcher(map2010);
      addBasemapSwitcher(map2022);

      var zoomToHarvardButton = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
    
        onAdd: function (map) {
            if (map === map2010) { 
                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    
                container.innerHTML = '<button onclick="zoomToHarvard()"><img src="https://beautyroute.com/s1blog//wp-content/uploads/2018/06/blog_ellewoodshair_2.jpg" alt="Harvard Image" style="width:50px;height:50px;"></button>';
    
                return container;
            } else {
                return null; 
            }
        }
    });
    
    (new zoomToHarvardButton()).addTo(map2010);
    
    function zoomToHarvard() {
        var harvardCoordinates = [42.3785, -71.1192]; 
        var zoomLevel = 15; 
    
        map2010.setView(harvardCoordinates, zoomLevel, { animate: true });
    }
    var resetMap2010Button = L.Control.extend({
        options: {
            position: 'topright'
        },
    
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            container.innerHTML = '<button onclick="resetMap2010()">Reset Map</button>';
            return container;
        }
    });
    
    (new resetMap2010Button()).addTo(map2022);
    
    function resetMap2010() {
        var initialPosition = [39.8283, -98.5795]; 
        var initialZoom = 4; 
    
        map2010.setView(initialPosition, initialZoom, { animate: true });
  
    }function showInitialPopup() {
        var popupContent = "<p>Control both maps with the one on the left!<br> <br> Click anywhere on the left map to begin!</p>";
    
        var initialPopup = L.popup({
            closeButton: false,
            autoClose: false,
            className: 'initial-popup'
        })
            .setLatLng(map2010.getCenter())
            .setContent(popupContent)
            .openOn(map2010);
    
        currentOpenPopup = initialPopup;
    }
    
    function closeInitialPopup() {
        if (currentOpenPopup) {
            currentOpenPopup.close();
            currentOpenPopup = null;
        }
    }
    
    showInitialPopup();