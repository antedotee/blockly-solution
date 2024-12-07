import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../Navbar/Navbar";
import TimeFrameModal from "../TimeFrameModal/TimeFrameModal";
import SimulationControlModal from "../SimulationControlModal/SimulationControlModal";
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

  switch (timeFrame) {
    case "lastWeek":
      return baseCoordinates.map(([lat, lng]) => [lat - 0.01, lng - 0.01]);
    case "nextWeek":
      return baseCoordinates.map(([lat, lng]) => [lat + 0.01, lng + 0.01]);
    default:
      return baseCoordinates;
  }
};

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState([37.7749, -122.4194]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showTimeFrameModal, setShowTimeFrameModal] = useState(false);
  const [showSimulationControl, setShowSimulationControl] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(null);

  const handleTimeFrameSelect = (timeFrame) => {
    const newRouteCoordinates = generateRouteCoordinates(timeFrame);
    setRouteCoordinates(newRouteCoordinates);
    setCurrentPosition(newRouteCoordinates[0]);
    setRouteIndex(0);
    setSelectedTimeFrame(timeFrame);
    setShowTimeFrameModal(false);
  };

  const startSimulation = () => {
    setRouteIndex(0);
    setCurrentPosition(routeCoordinates[0]);
    setIsMoving(true);
    setShowSimulationControl(true);
  };

  const handlePlay = () => setIsMoving(true);
  const handlePause = () => setIsMoving(false);
  const handleRestart = () => {
    setRouteIndex(0);
    setCurrentPosition(routeCoordinates[0]);
    setIsMoving(true);
  };
  const handleSpeedChange = (speed) => setSimulationSpeed(speed);

  useEffect(() => {
    if (isMoving) {
      const intervalId = setInterval(() => {
        if (routeIndex < routeCoordinates.length - 1) {
          setRouteIndex((prevIndex) => prevIndex + 1);
          setCurrentPosition(routeCoordinates[routeIndex + 1]);
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
        <button
          onClick={() => setShowTimeFrameModal(true)}
          className="select-time-frame-button"
        >
          Select Time Frame
        </button>
        {selectedTimeFrame && (
          <button onClick={startSimulation} className="start-simulation-button">
            Start Simulation
          </button>
        )}
      </div>
      <TimeFrameModal
        isOpen={showTimeFrameModal}
        onClose={() => setShowTimeFrameModal(false)}
        onSelectTimeFrame={handleTimeFrameSelect}
      />
      <SimulationControlModal
        isOpen={showSimulationControl}
        onClose={() => setShowSimulationControl(false)}
        onPlay={handlePlay}
        onPause={handlePause}
        onRestart={handleRestart}
        onSpeedChange={handleSpeedChange}
        isPlaying={isMoving}
      />
    </div>
  );
};

export default Map;
