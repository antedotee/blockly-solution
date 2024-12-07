import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  // useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../Navbar/Navbar";
import "./Map.css";

const carIconBase = new L.Icon({
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

  const mapRef = useRef(null);

  const handleTimeFrameSelect = (event) => {
    const selectedFrame = event.target.value;
    setSelectedTimeFrame(selectedFrame);
    const newRouteCoordinates = generateRouteCoordinates(selectedFrame);
    setRouteCoordinates(newRouteCoordinates);
    setCurrentPosition(newRouteCoordinates[0]);
    setRouteIndex(0);

    if (mapRef.current) {
      mapRef.current.setView(newRouteCoordinates[0], mapRef.current.getZoom());
    }
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
    setIsMoving(false);
    setShowControls(false);
    setSelectedTimeFrame("");
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
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {routeCoordinates.length > 0 && (
          <>
            <Polyline positions={routeCoordinates} color="green" />
            <Marker position={currentPosition} icon={carIconBase} />
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
