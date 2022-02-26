class MapService {
  addMarker(lat, long, H, map) {
    var LocationOfMarker = { lat: lat, lng: long };
    // Create a marker icon from an image URL:
    var icon = new H.map.Icon("../assets/plane/plane.png");

    // Create a marker using the previously instantiated icon:
    var marker = new H.map.Marker(LocationOfMarker, { icon: icon });

    // Add the marker to the map:
    map.addObject(marker);
  }
}
