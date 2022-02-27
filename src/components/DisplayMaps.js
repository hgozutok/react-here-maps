import React, { useRef, useLayoutEffect, useState } from "react";
// import MapService from "../services/MapService";
// import * as icons from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlaneService from "../services/PlaneServices";
export default function DisplayMaps() {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  // const mapRef = useMaps();
  const H = window.H;
  const [ui, setUi] = React.useState({});
  const [mapData, setMapData] = React.useState([]);
  const [oldMapData, setOldMapData] = React.useState([]);

  // useEffect(() => {}, []);

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

    //console.log(response);

    //console.log(mapData);

    //addMarker(12.2684, 57.6498, 556.26, hMap, myui, 205.8);
    // addMarker(
    //   mapData[0].latitude,
    //   mapData[0].longitude,
    //   mapData[0].geo_altitude,
    //   hMap,
    //   myui,
    //   mapData[0].true_track
    // );

    // planes.forEach((element) => {
    //   addMarker(
    //     element.latitude,
    //     element.longitude,
    //     element.geo_altitude ? element.geo_altitude : 0,
    //     hMap,
    //     myui,
    //     element.true_track ? element.true_track : 0
    //   );
    // });
  };

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

    // setInterval(() => {
    loadPlanes(hMap, ui);
    // }, 5000);
    // hMap.addEventListener("mapviewchangeend", async function () {
    //   setInterval(async () => {
    //     await loadPlanes(hMap, ui);
    //   }, 5000);
    // });
    window.addEventListener("resize", () => hMap.getViewPort().resize());

    // const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));
    var myui = H.ui.UI.createDefault(hMap, defaultLayers);
    setUi(myui);
    // addInfoBubble(hMap, myui);

    //await loadPlanes(hMap, myui);

    // addMarker(52.52, 13.4, 1000, hMap, myui, 45);

    setMap(hMap);
    console.log(map);
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
            // console.log(clonedElement);

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
    );
    // point.setPosition({ lat: number, lng: number });

    //map.removeObject(point);
    var marker = map.addObject(point);

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

  // const addMarkerToGroup = (group, coordinate, html) => {
  //   var marker = new H.map.Marker(coordinate);
  //   marker.setData(html);
  //   group.addObject(marker);
  // };

  // const addInfoBubble = (map, mui) => {
  //   var group = new H.map.Group();

  //   map.addObject(group);

  //   group.addEventListener(
  //     "tap",
  //     function (evt) {
  //       // var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
  //       //   content: evt.target.getData(),
  //       // });
  //       var bubble = new H.ui.InfoBubble(
  //         { lat: 52.5, lng: 13.4 },
  //         {
  //           content: "<div>hello</div>",
  //         }
  //       );

  //       mui.addBubble(bubble);
  //     },
  //     false
  //   );

  //   addMarkerToGroup(
  //     group,
  //     { lat: 52.5, lng: 13.4 },
  //     "<div>Flight Info</div>" +
  //       "<div>City of Manchester Stadium<br />Capacity: 55,097</div>"
  //   );
  // };

  useLayoutEffect(() => {
    const getdata = async () => {
      loadMap();
    };
    getdata();
  }, [mapData]);

  return <div className="map" ref={mapRef} />;
}
