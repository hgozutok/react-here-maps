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
  ]);

  const addMarker = (plane, map, mui) => {
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

            // "<div>Flight Info</div>" + "<div>origin_country :" + plane[2]
            //   ? plane[2]
            //   : "" + " <br /></div>" + "<div> icao24 : " + plane[0]
            //   ? plane[0]
            //   : "" + "<br /></div>" + "<div> velocity: " + plane[9]
            //   ? plane[9]
            //   : "" + +"</div>",
          }
        );

        mui.addBubble(bubble);
      },
      false
    );
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
  };
};

export default useMaps;
