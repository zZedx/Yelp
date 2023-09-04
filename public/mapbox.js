mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: camp.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});
new mapboxgl.Marker()
.setLngLat(camp.coordinates)
.addTo(map);