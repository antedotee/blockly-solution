import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar/Navbar";

// Car icon configuration
const carIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const routeCoordinates = [
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

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(routeCoordinates[0]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const startSimulation = () => {
    setRouteIndex(0);
    setCurrentPosition(routeCoordinates[0]);
    setIsMoving(true);
  };

  React.useEffect(() => {
    if (isMoving) {
      const intervalId = setInterval(() => {
        if (routeIndex < routeCoordinates.length - 1) {
          setRouteIndex((prevIndex) => prevIndex + 1);
          setCurrentPosition(routeCoordinates[routeIndex + 1]);
        } else {
          clearInterval(intervalId); // Stop the interval when the destination is reached
          setIsMoving(false); // Reset the movement state
        }
      }, 1000); // Move the car every second

      return () => clearInterval(intervalId);
    }
  }, [isMoving, routeIndex]);

  return (
    <div>
      <Navbar />
      <MapContainer
        center={routeCoordinates[0]}
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <Polyline positions={routeCoordinates} color="red" />
        <Marker position={currentPosition} icon={carIcon} />
      </MapContainer>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <button
          onClick={startSimulation}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start Simulation
        </button>
      </div>
    </div>
  );
};

export default Map;
