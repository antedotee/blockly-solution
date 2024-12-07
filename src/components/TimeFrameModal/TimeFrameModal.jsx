import React, { useState } from "react";
import "./TimeFrameModal.css";

const TimeFrameModal = ({ isOpen, onClose, onSelectTimeFrame }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("");

  const handleSelectTimeFrame = () => {
    onSelectTimeFrame(selectedTimeFrame);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="time-frame-modal">
        <h2>Select Time Frame</h2>
        <select
          onChange={(e) => setSelectedTimeFrame(e.target.value)}
          value={selectedTimeFrame}
        >
          <option value="">Select time frame</option>
          <option value="today">Today</option>
          <option value="lastWeek">Last Week</option>
          <option value="nextWeek">Next Week</option>
        </select>
        <button onClick={handleSelectTimeFrame}>Confirm</button>
      </div>
    </>
  );
};

export default TimeFrameModal;
