import React from "react";
import axios from "axios";

export const usePlanes = () => {
  const [planesData, setPlanesData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [planesOldData, setPlanesOldData] = React.useState([]);

  React.useLayoutEffect(() => {
    const getPlanes = async () => {
      try {
        setIsLoading(true);
        axios.get(process.env.REACT_APP_OPENSKY_GET_ALL).then((response) => {
          setPlanesOldData(planesData.slice(0, 100));
          setPlanesData(response.data.states.slice(0, 100));
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
  }, [planesData]);
  return { planesData, isLoading, error, planesOldData };
};
export default usePlanes;
