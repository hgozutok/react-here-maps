import React from "react";
import { useEffect, useRef } from "react";
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
    if (!isLoading && mapRef.current) {
      console.log(planesData);
      planesData.slice(0, 200).forEach((data) => {
        addMarker(
          data[5] ? data[5] : 0,
          data[6] ? data[6] : 0,
          data[13] ? data[13] : 0,
          map,
          ui,
          data[10] ? data[10] : 0
        );
      });
    }
  }, [isMapLoading, isLoading, planesData]);

  return <div className="map" ref={mapRef} />;
};
