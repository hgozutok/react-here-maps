import "./App.css";

import { HereMap } from "./components/HereMap";

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
