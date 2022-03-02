import React, { useRef } from "react";

export const useMaps = () => {
  const H = window.H;
  const mapRef = useRef();
  const [map, setMap] = React.useState(null);
  const [ui, setUi] = React.useState({});
  const [isMapLoading, setIsMapLoading] = React.useState(true);
  const [defaultLayers, setDefaultLayers] = React.useState(null);
  const [behavior, setBehavior] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [refresh, setRefresh] = React.useState(false);

  React.useLayoutEffect(() => {
    const getMap = () => {
      try {
        setIsMapLoading(true);
        if (!mapRef.current) return;

        const platform = new H.service.Platform({
          apikey: process.env.REACT_APP_HERE_API_KEY,
        });
        const defaultLayers = platform.createDefaultLayers();
        setDefaultLayers(defaultLayers);
        const hMap = new H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map,
          {
            center: { lat: 52.52, lng: 13.4 },
            zoom: 8,
            pixelRatio: window.devicePixelRatio || 1,
          }
        );

        // hMap.addEventListener("loaded", async function () {
        //   // setInterval(async () => {
        //   //   await loadPlanes(hMap, ui);
        //   // }, 5000);
        // });
        window.addEventListener("resize", () => hMap.getViewPort().resize());

        const behavior = new H.mapevents.Behavior(
          new H.mapevents.MapEvents(hMap)
        );
        setBehavior(behavior);
        const mui = H.ui.UI.createDefault(hMap, defaultLayers);
        setUi(mui);
        setMap(hMap);
      } catch (error) {
        setError(error);
      } finally {
        setTimeout(() => {
          setIsMapLoading(false);
          setError(null);
        }, 1000);
      }

      //setMap(hMap);
      // setIsMapLoading(false);
      // This will act as a cleanup to run once this hook runs again.
      // This includes when the component un-mounts
      // return () => {
      //   hMap.dispose();
      // };
    };
    getMap();
  }, [
    H.Map,
    H.mapevents.Behavior,
    H.mapevents.MapEvents,
    H.service.Platform,
    H.ui.UI,
    refresh,
  ]);

  const refreshMarkers = (map, ui, planesData, planesOldData) => {
    var objects = map.getObjects(),
      len = map.getObjects().length;

    for (let i = 0; i < len; i++) {
      let oLat = objects[i].getGeometry().lat;
      let oLng = objects[i].getGeometry().lng;
      // console.log(objects[i].getGeometry().lng);

      planesOldData.filter((element) => {
        return () => {
          if (element[5] === oLat && element[6] === oLng) {
            planesData.filter((newElement) => {
              return () => {
                if (newElement[0] === element[0]) {
                  if (newElement[5] !== oLat || newElement[6] !== oLng) {
                    return objects[i].setGeometry({
                      lat: newElement[5],
                      lng: newElement[6],
                    });

                    // console.log(
                    //   "moved",
                    //   element[5],
                    //   element[6],
                    //   newElement[5],
                    //   newElement[6]
                    // );
                  }
                }
              };
            });
          }
        };
      });
    }
  };
  const deleteAllMarkers = (map, ui, planesData, planesOldData) => {
    var objects = map.getObjects(),
      len = map.getObjects().length,
      i;

    for (i = 0; i < len; i += 1) {
      map.removeObject(objects[i]);
    }
  };
  const addMarker = (plane, map, mui, planesData) => {
    var domIconElement = document.createElement("div"),
      interval = 0;

    domIconElement.innerHTML =
      '<img src="../assets/plane/plane.png" width="40px" />';
    var point = new H.map.DomMarker(
      { lat: plane[5], lng: plane[6], alt: plane[13] },
      {
        icon: new H.map.DomIcon(domIconElement, {
          onAttach: function (clonedElement, domIcon, domMarker) {
            var clonedContent = clonedElement.getElementsByTagName("img")[0];
            // console.log(clonedElement);

            clonedContent.style.transform = "rotate(" + plane[10] + "deg)";
          },
          onDetach: function (clonedElement, domIcon, domMarker) {
            clearInterval(interval);
          },
        }),
      }
    );
    // point.setPosition({ lat: number, lng: number });

    //map.removeObject(point);
    // const myMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map);
    var marker = map.addObject(point);

    map.addObject(marker);

    setInterval(() => {
      planesData.filter((element) => {
        return () => {
          if (element["icao24"] === plane["icao24"]) {
            marker.setGeometry({ lat: plane[5], lng: plane[6] });
            //  console.log(plane[5], plane[6]);
          }
        };
      });
    }, 10000);

    marker.addEventListener(
      "tap",
      function (evt) {
        var bubble = new H.ui.InfoBubble(
          { lat: plane[5], lng: plane[6] },
          {
            content:
              "<div>origin_country:" +
              plane[2] +
              "</div>" +
              "<div>icao24 : " +
              plane[0] +
              "</div>" +
              "<div>velocity:" +
              plane[9] +
              "</div>",
          }
        );

        mui.addBubble(bubble);
      },
      false
    );
    // setRefresh(true);
  };
  // const addHtml = () => {
  //   return <div className="map" ref={mapRef} />;
  // };

  return {
    addMarker,
    mapRef,
    map,
    ui,
    isMapLoading,
    defaultLayers,
    error,
    behavior,
    refreshMarkers,
    setRefresh,
    deleteAllMarkers,
  };
};

export default useMaps;
