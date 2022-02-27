import axios from "axios";

var planesData = [];
class PlaneService {
  static async getPlanes() {
    setInterval(async () => {
      await axios
        .get(
          // "https://" +
          //   process.env.REACT_APP_OPENSKY_USERNAME +
          //   ":" +
          //   process.env.REACT_APP_OPENSKY_PASSWORD +
          //   "@" +
          process.env.REACT_APP_OPENSKY_GET_ALL
        )
        .then((response) => {
          planesData = response.data.states;
          console.log(planesData);
          return planesData;
        });
    }, 10000);
    console.log(planesData);

    return planesData;

    // await axios
    //   .get(
    //     "https://" +
    //       process.env.REACT_APP_OPENSKY_USERNAME +
    //       ":" +
    //       process.env.REACT_APP_OPENSKY_PASSWORD +
    //       "@" +
    //       process.env.REACT_APP_OPENSKY_GET_ALL
    //   )
    //   .then((response) => {
    //     planesData = response.data.states;
    //     console.log(planesData);
    //     return planesData;
    //   });
    // return planesData;
  }
}
export default new PlaneService();
