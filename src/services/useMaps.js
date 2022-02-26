import React, { useEffect, useRef } from "react";

export const useMaps = () => {
  const H = window.H;
  const mapRef = useRef();
  const [map, setMap] = React.useState(null);

  const getMap = () => {
    // `mapRef.current` will be `undefined` when this hook first runs; edge case that
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

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));

    const ui = H.ui.UI.createDefault(hMap, defaultLayers);
    setMap(hMap);

    // This will act as a cleanup to run once this hook runs again.
    // This includes when the component un-mounts
    return () => {
      hMap.dispose();
    };
  };
  React.useLayoutEffect(() => {
    getMap();
  }, [mapRef]);

  const addMarker = (lat, long) => {
    var LocationOfMarker = { lat: lat, lng: long };
    // Create a marker icon from an image URL:
    var icon = new H.map.Icon("../assets/plane/plane.png");

    // Create a marker using the previously instantiated icon:
    var marker = new H.map.Marker(LocationOfMarker, { icon: icon });

    // Add the marker to the map:
    map.addObject(marker);
  };
  const addHtml = () => {
    return <div className="map" ref={mapRef} />;
  };

  return { addMarker, getMap, mapRef };
};

export default useMaps;
