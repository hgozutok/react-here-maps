import React from "react";
import axios from "axios";

export const usePlanes = () => {
  const [planesData, setPlanesData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    const getPlanes = async () => {
      try {
        setIsLoading(true);
        await axios
          .get(process.env.REACT_APP_OPENSKY_GET_ALL)
          .then((response) => {
            setPlanesData(response.data.states);
            //console.log(planesData);
            //return planesData;
          });
      } catch (error) {
        setError(error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          setError(null);
        }, 1000);
      }
    };
    getPlanes();
  }, []);
  return { planesData, isLoading, error };
};
