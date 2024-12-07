import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../Navbar/Navbar";
import "./Map.css";

const carIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const generateRouteCoordinates = (timeFrame) => {
  const baseCoordinates = [
    [37.7749, -122.4194],
    [37.7757, -122.4218],
    [37.7768, -122.4239],
    [37.778, -122.4263],
    [37.7792, -122.4287],
    [37.7804, -122.431],
    [37.7816, -122.4334],
    [37.7828, -122.4358],
    [37.784, -122.4382],
    [37.7852, -122.4406],
  ];

  // const baseCoordinates = [
  //   [25.4484, 78.5698],
  //   [25.46250658831843, 78.5639447300946],
  //   [25.476612873155084, 78.55808796960322],
  //   [25.490718854095046, 78.55222971677979],
  //   [25.504824530721486, 78.54636996987229],
  //   [25.51892990261558, 78.54050872712263],
  //   [25.53303496935652, 78.53464598676659],
  //   [25.547139730521497, 78.52878174703378],
  //   [25.561244185685638, 78.5229160061475],
  //   [25.575348334422017, 78.51704876232473],
  //   [25.58945217630163, 78.51118001377603],
  //   [25.603555710893332, 78.50530975870541],
  //   [25.617658937763824, 78.49943799531036],
  //   [25.63176185647768, 78.49356472175511],
  //   [25.645864466597332, 78.48768993619063],
  //   [25.659966767683064, 78.48181363675572],
  //   [25.674068759293025, 78.47593582157685],
  //   [25.688170440983206, 78.47005648876829],
  //   [25.702271812307462, 78.46417563644203],
  //   [25.716372872817476, 78.45829326270785],
  //   [25.730473622062766, 78.45240936567332],
  //   [25.74457405959071, 78.44652394344379],
  //   [25.75867418494652, 78.44063699412246],
  //   [25.77277400022536, 78.43474851581035],
  //   [25.786873505170336, 78.42885850660625],
  //   [25.800972700425547, 78.42296696460685],
  //   [25.815071586635136, 78.41707388790655],
  //   [25.829170163443367, 78.41117927459764],
  //   [25.843268430494647, 78.40528312277021],
  //   [25.857366387433565, 78.39938543051217],
  //   [25.871464033904923, 78.39348619590926],
  //   [25.885561369553772, 78.38758541704502],
  //   [25.899658394025444, 78.38168309199979],
  //   [25.9137551069656, 78.3757792188507],
  //   [25.927851507899262, 78.36987379567163],
  //   [25.941947596361875, 78.36396682053331],
  //   [25.95604337188935, 78.35805829150314],
  //   [25.970138833017112, 78.35214820664533],
  //   [25.98423397928015, 78.3462365640209],
  //   [25.998328810213015, 78.34032336168754],
  //   [26.01242332534999, 78.33440859769979],
  // ];

  switch (timeFrame) {
    case "lastWeek":
      return baseCoordinates.map(([lat, lng]) => [lat - 0.01, lng - 0.01]);
    case "lastMonth":
      return baseCoordinates.map(([lat, lng]) => [lat - 0.02, lng - 0.02]);
    default:
      return baseCoordinates;
  }
};

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState([37.7749, -122.4194]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("");
  const [progress, setProgress] = useState(0);

  const handleTimeFrameSelect = (event) => {
    setSelectedTimeFrame(event.target.value);
    const newRouteCoordinates = generateRouteCoordinates(event.target.value);
    setRouteCoordinates(newRouteCoordinates);
    setCurrentPosition(newRouteCoordinates[0]);
    setRouteIndex(0);
  };

  const startSimulation = () => {
    setShowControls(true);
    setIsMoving(true);
  };

  const handlePlay = () => setIsMoving(true);
  const handlePause = () => setIsMoving(false);
  const handleRestart = () => {
    setRouteIndex(0);
    setCurrentPosition(routeCoordinates[0]);
    setProgress(0);
    setIsMoving(true);
  };
  const handleSpeedChange = (event) =>
    setSimulationSpeed(Number(event.target.value));

  useEffect(() => {
    if (isMoving && routeCoordinates.length > 0) {
      const intervalId = setInterval(() => {
        if (routeIndex < routeCoordinates.length - 1) {
          setRouteIndex((prevIndex) => prevIndex + 1);
          setCurrentPosition(routeCoordinates[routeIndex + 1]);
          setProgress(((routeIndex + 1) / (routeCoordinates.length - 1)) * 100);
        } else {
          clearInterval(intervalId);
          setIsMoving(false);
        }
      }, 1000 / simulationSpeed);

      return () => clearInterval(intervalId);
    }
  }, [isMoving, routeIndex, routeCoordinates, simulationSpeed]);

  return (
    <div>
      <Navbar />
      <MapContainer
        center={routeCoordinates[0] || [37.7749, -122.4194]}
        zoom={14}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {routeCoordinates.length > 0 && (
          <>
            <Polyline positions={routeCoordinates} color="red" />
            <Marker position={currentPosition} icon={carIcon} />
          </>
        )}
      </MapContainer>
      <div className="controls-container">
        {!showControls ? (
          <>
            <select
              value={selectedTimeFrame}
              onChange={handleTimeFrameSelect}
              className="time-frame-select"
            >
              <option value="">Select from below</option>
              <option value="today">Today</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
            </select>
            <button
              onClick={startSimulation}
              className="start-simulation-button"
              disabled={!selectedTimeFrame}
            >
              Start Simulation
            </button>
          </>
        ) : (
          <div className="simulation-controls">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => {
                const newIndex = Math.floor(
                  (routeCoordinates.length - 1) * (Number(e.target.value) / 100)
                );
                setRouteIndex(newIndex);
                setCurrentPosition(routeCoordinates[newIndex]);
                setProgress(Number(e.target.value));
              }}
              className="progress-slider"
            />
            <button
              onClick={isMoving ? handlePause : handlePlay}
              className="play-pause-button"
            >
              {isMoving ? "Pause" : "Play"}
            </button>
            <button onClick={handleRestart} className="restart-button">
              Restart
            </button>
            <input
              type="range"
              min="1"
              max="10"
              value={simulationSpeed}
              onChange={handleSpeedChange}
              className="speed-slider"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
