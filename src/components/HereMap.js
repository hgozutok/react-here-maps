// Hugo software
import React from "react";

import useMaps from "../services/useMaps";
import { usePlanes } from "../services/usePlanes";

export const HereMap = () => {
  const { addMarker, mapRef, map, ui, isMapLoading, refreshMarkers } =
    useMaps();
  const { planesData, isLoading, error, planesOldData } = usePlanes();
  React.useLayoutEffect(() => {
    // getMap();

    // if (!isMapLoading && mapRef.current) {
    //   // console.log(map);
    //   // console.log(ui);
    //   //   localStorage.setItem("map", JSON.stringify(map));
    // }
    if (!isLoading && mapRef.current && !error) {
      planesData.forEach((data) => {
        addMarker(data, map, ui, planesData);
      });

      setInterval(() => {
        planesData.forEach((data) => {
          refreshMarkers(map, ui, planesData, planesOldData);
        });
        // deleteAllMarkers();map, ui, planesData, planesOldData
        // planesData.forEach((data) => {
        //   addMarker(data, map, ui, planesData);
        // });
      }, 20000);

      // console.log(planesData);
    }
  }, [
    isMapLoading,
    isLoading,
    planesData,
    addMarker,
    map,
    mapRef,
    ui,
    error,
    planesOldData,
    refreshMarkers,
  ]);

  return <div className="map" ref={mapRef} />;
};
