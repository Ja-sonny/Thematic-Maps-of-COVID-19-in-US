mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    projection: {
        name: 'albers'
    },
    center: [-97, 40], // starting position [lng, lat]
    zoom: 4 // starting zoom
});

const grades = [100, 1000, 10000, 25000, 50000, 75000]
      colors = ['rgb(199,233,180)', 'rgb(127,205,187)', 'rgb(65,182,196)',
                'rgb(29,145,192)', 'rgb(34,94,168)', 'rgb(12,44,132)'],
      radii = [2, 4, 6, 10, 15, 20];

map.on('load', () => {
    map.addSource('counts', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.geojson'
    });

    map.addLayer({
        'id': 'covid-point',
        'type': 'circle',
        'source': 'counts',
        'paint': {
            'circle-radius': {
                'property': 'cases',
                'stops': [
                  [grades[0], radii[0]],
                  [grades[1], radii[1]],
                  [grades[2], radii[2]],
                  [grades[3], radii[3]],
                  [grades[4], radii[4]],
                  [grades[5], radii[5]]
                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                  [grades[0], colors[0]],
                  [grades[1], colors[1]],
                  [grades[2], colors[2]],
                  [grades[3], colors[3]],
                  [grades[4], colors[4]],
                  [grades[5], colors[5]]
                ]
            },
            'circle-stroke-color': 'blue',
            'circle-stroke-width': 1,
            'circle-opacity': 0.55
        }
    });

    map.on('click', 'covid-point', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>County:</strong> ${event.features[0].properties.county}<br><strong>Cases:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });

});

const legend = document.getElementById('legend');

var labels = ['<strong>Size, Color, and Cases</strong>'], vbreak;

for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i]
    // you need to manually adjust the radius of each dot on the legend
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radius = 1.5*radii[i];
    labels.push(
      '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: 0' + dot_radius +
      'px; height: ' +
      dot_radius + 'px; "></i> <span class="dot-label" style="top: ' + dot_radius / 2 + 'px;">' + vbreak +
      '</span></p>');
}
const source1 =
'<p style="text-align: right;  font-size:8pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times,</a><br></p>';

const source2 =
'<p style="text-align: right;  font-size:8pt"><a href="https://data.census.gov/cedsci/table?g=0100000US.050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true"> Census Bureau</a><br></p>';

legend.innerHTML = labels.join('') + source1 + source2;





