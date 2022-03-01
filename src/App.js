import "./App.css";
import DisplayMaps from "./components/DisplayMaps";
import { HereMap } from "./components/HereMap";
import { Map } from "./components/Map";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <p>Hugo Flight Map</p>
      </div>

      {/* <DisplayMaps /> */}
      {/* <Map /> */}
      <HereMap />
    </div>
  );
}

export default App;
