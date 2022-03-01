// Hugo software
import React from "react";

import useMaps from "../services/useMaps";
import { usePlanes } from "../services/usePlanes";

export const HereMap = () => {
  const { addMarker, mapRef, map, ui, isMapLoading } = useMaps();
  const { planesData, isLoading, error } = usePlanes();
  React.useLayoutEffect(() => {
    // getMap();

    if (!isMapLoading && mapRef.current) {
      console.log(map);
      console.log(ui);
    }
    if (!isLoading && mapRef.current && !error) {
      console.log(planesData);
      planesData.slice(0, 2000).forEach((data) => {
        addMarker(data, map, ui);
      });
    }
  }, [isMapLoading, isLoading, planesData, addMarker, map, mapRef, ui, error]);

  return <div className="map" ref={mapRef} />;
};
