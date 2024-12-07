import React from 'react';
import './SimulationControlModal.css';

const SimulationControlModal = ({
  isOpen,
  onClose,
  onPlay,
  onPause,
  onRestart,
  onSpeedChange,
  isPlaying,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="simulation-control-modal">
        <h2>Simulation Control</h2>
        <div className="button-group">
          <button onClick={isPlaying ? onPause : onPlay}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={onRestart}>Restart</button>
        </div>
        <div className="speed-control">
          <label htmlFor="speed-slider">Simulation Speed</label>
          <input
            id="speed-slider"
            type="range"
            min="1"
            max="10"
            step="1"
            defaultValue="1"
            onChange={(e) => onSpeedChange(Number(e.target.value))}
          />
        </div>
      </div>
    </>
  );
};

export default SimulationControlModal;

