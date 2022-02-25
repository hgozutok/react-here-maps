import logo from "./logo.svg";
import "./App.css";
import DisplayMaps from "./components/DisplayMaps";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>Hugo Flight Map</p>
      </div>

      <DisplayMaps />
    </div>
  );
}

export default App;
