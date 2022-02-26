import React, { useEffect, useRef } from "react";
import MapService from "../services/MapService";
import * as icons from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    addMarker(52.52, 13.4, 1000, hMap, myui, 45);
    addMarker(51.52, 12.4, 50000, hMap, myui, 70);
    addMarker(53.52, 14.4, 15000, hMap, myui, 176);

    setMap(hMap);
    console.log(map);

    // return () => {
    //   hMap.dispose();
    // };
  }, []);

  const addMarker = (lat, long, alt = 0, map, mui, rotateDegree = 0) => {
    var LocationOfMarker = { lat: lat, lng: long, alt: alt };

    var icon = new H.map.Icon("../assets/plane/plane.png");

    var domIconElement = document.createElement("div"),
      interval = 0;

    domIconElement.innerHTML =
      '<img src="../assets/plane/plane.png" width="40px" />';

    var marker = map.addObject(
      new H.map.DomMarker(
        { lat: lat, lng: long },
        {
          icon: new H.map.DomIcon(domIconElement, {
            onAttach: function (clonedElement, domIcon, domMarker) {
              var clonedContent = clonedElement.getElementsByTagName("img")[0];
              console.log(clonedElement);

              clonedContent.style.transform = "rotate(" + rotateDegree + "deg)";

              // set interval to rotate icon's content by 45 degrees every second.
              //   interval = setInterval(function () {
              //     clonedContent.style.transform =
              //       "rotate(" + (counter += 45) + "deg)";
              //   }, 5000);
            },
            onDetach: function (clonedElement, domIcon, domMarker) {
              // stop the rotation if dom icon is not in map's viewport
              clearInterval(interval);
            },
          }),
        }
      )
    );

    // var marker = new H.map.Marker(LocationOfMarker, {
    //   icon: icon,
    // });

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
