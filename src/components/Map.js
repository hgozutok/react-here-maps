import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import PlaneService from "../services/PlaneServices";

export const Map = () => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const H = window.H;
  const [ui, setUi] = React.useState({});
  const [mapData, setMapData] = React.useState([]);
  const [oldMapData, setOldMapData] = React.useState([]);

  useLayoutEffect(() => {
    const loadMap = async () => {
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

      loadPlanes(hMap, ui);

      window.addEventListener("resize", () => hMap.getViewPort().resize());

      var myui = H.ui.UI.createDefault(hMap, defaultLayers);
      setUi(myui);

      setMap(hMap);
      console.log(map);
    };
    const loadPlanes = async (hMap, myui) => {
      const response = await PlaneService.getPlanes();
      setOldMapData(mapData);
      setMapData(response);

      response.slice(0, 100).map((data) => {
        console.log(oldMapData);

        console.log(mapData[5], mapData[6], mapData[13]);
        console.log(response[5], response[6], response[13]);
        return addMarker(
          data[5] ? data[5] : 0,
          data[6] ? data[6] : 0,
          data[13] ? data[13] : 0,

          hMap,
          myui,
          data[10] ? data[10] : 0
        );
      });
    };
    const addMarker = (lat, long, alt = 0, map, mui, rotateDegree = 0) => {
      // var LocationOfMarker = { lat: lat, lng: long, alt: alt };

      //console.log(lat, long, alt);

      // var minDist = 1000,
      //   markerDist,
      //   objects = map.getObjects(),
      //   len = map.getObjects().length,
      //   i;

      // for (i = 0; i < len; i += 1) {
      //   markerDist = objects[i].getGeometry().distance({ lat: lat, lng: long });
      //   if (markerDist < minDist) {
      //     minDist = markerDist;
      //     console.log(objects[i], " objects[i]");
      //     map.removeObject(objects[i]);
      //   }
      // }

      // var icon = new H.map.Icon("../assets/plane/plane.png");

      var domIconElement = document.createElement("div"),
        interval = 0;

      domIconElement.innerHTML =
        '<img src="../assets/plane/plane.png" width="40px" />';
      var point = new H.map.DomMarker(
        { lat: lat, lng: long },
        {
          icon: new H.map.DomIcon(domIconElement, {
            onAttach: function (clonedElement, domIcon, domMarker) {
              var clonedContent = clonedElement.getElementsByTagName("img")[0];

              clonedContent.style.transform = "rotate(" + rotateDegree + "deg)";

              // set interval to rotate icon's content by 45 degrees every second.
              //   interval = setInterval(function () {
              //     clonedContent.style.transform =
              //       "rotate(" + (counter += 45) + "deg)";
              //   }, 5000);
            },
            onDetach: function (clonedElement, domIcon, domMarker) {
              clearInterval(interval);
            },
          }),
        }
      );

      var marker = map.addObject(point);

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

    loadMap();
  }, []);
  return <div className="map" ref={mapRef} />;
};
