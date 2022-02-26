import React, { useEffect, useRef } from "react";
import MapService from "../services/MapService";
export default function DisplayMaps() {
  const mapRef = useRef();
  const [map, setMap] = React.useState(null);
  // const mapRef = useMaps();
  const H = window.H;
  const [ui, setUi] = React.useState();

  React.useLayoutEffect(() => {
    if (!mapRef.current) return;
    const platform = new H.service.Platform({
      apikey: process.env.REACT_APP_HERE_API_KEY,
    });
    const defaultLayers = platform.createDefaultLayers();
    const hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: { lat: 52.52, lng: 13.4 },
      zoom: 8,
      pixelRatio: window.devicePixelRatio || 1,
    });
    window.addEventListener("resize", () => hMap.getViewPort().resize());

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));
    var myui = H.ui.UI.createDefault(hMap, defaultLayers);
    setUi(myui);
    // addInfoBubble(hMap, myui);
    addMarker(52.52, 13.4, 1000, hMap, myui);
    addMarker(51.52, 12.4, 50000, hMap, myui);
    addMarker(53.52, 14.4, 15000, hMap, myui);

    setMap(hMap);
    console.log(map);

    // return () => {
    //   hMap.dispose();
    // };
  }, []);

  const addMarker = (lat, long, alt = 0, map, mui) => {
    var LocationOfMarker = { lat: lat, lng: long, alt: alt };
    // Create a marker icon from an image URL:
    var icon = new H.map.Icon("../assets/plane/plane.png");

    // Create a marker using the previously instantiated icon:
    var marker = new H.map.Marker(LocationOfMarker, {
      icon: icon,
    });

    map.addObject(marker);
    marker.addEventListener(
      "tap",
      function (evt) {
        var bubble = new H.ui.InfoBubble(
          { lat: lat, lng: long },
          {
            content:
              "<div>Flight Info</div>" +
              "<div>from : <br /> to : <br />Capacity: 55,097</div>",
          }
        );

        mui.addBubble(bubble);
      },
      false
    );
  };

  const addMarkerToGroup = (group, coordinate, html) => {
    var marker = new H.map.Marker(coordinate);
    marker.setData(html);
    group.addObject(marker);
  };

  const addInfoBubble = (map, mui) => {
    var group = new H.map.Group();

    map.addObject(group);

    group.addEventListener(
      "tap",
      function (evt) {
        // var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        //   content: evt.target.getData(),
        // });
        var bubble = new H.ui.InfoBubble(
          { lat: 52.5, lng: 13.4 },
          {
            content: "<div>hello</div>",
          }
        );

        mui.addBubble(bubble);
      },
      false
    );

    addMarkerToGroup(
      group,
      { lat: 52.5, lng: 13.4 },
      "<div>Flight Info</div>" +
        "<div>City of Manchester Stadium<br />Capacity: 55,097</div>"
    );
  };

  return <div className="map" ref={mapRef} />;
}
