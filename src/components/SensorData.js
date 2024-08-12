import React, { useState, useEffect } from "react";
import "./SensorData.css";
import { useNavigate } from "react-router-dom";

const SensorData = () => {
  const [sensorData, setSensorData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/sensor-data");
        if (response.ok) {
          const data = await response.json();
          setSensorData(data);
        } else {
          console.error("Failed to fetch sensor data.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <>
      <div className="sensor-data-container">
        <h1>Sensor Data</h1>
        <table>
          <thead>
            <tr>
              <th>Data ID</th>
              <th>Sensor ID</th>
              <th>Timestamp</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.map((data) => (
              <tr key={data.dataId}>
                <td>{data.dataId}</td>
                <td>{data.sensorId}</td>
                <td>{formatTimestamp(data.timestamp)}</td>
                <td>{data.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SensorData;
