import React, { useState, useEffect } from 'react';
import '../Sensors/Sensors.css'; // Make sure to import the CSS file
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import clickableImageArduino from '../../assets/arduino.png';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import NotificationService from '../../NotificationService/NotificationService';

const Sensors = () => {
  const [sensorTypes, setSensorTypes] = useState([]); // State to store the sensor types
  const [babies, setBabies] = useState([]); // State to store the babies
  const [selectedSensorType, setSelectedSensorType] = useState(null); // State to store the selected sensor type
  const [selectedBaby, setSelectedBaby] = useState(null); // State to store the selected baby
  const [selectedIncubatorId, setSelectedIncubatorId] = useState(null); // State to store the selected incubatorId
  const navigate = useNavigate();

  const redirectToSensorType = (sensorTypeId) => {
    setSelectedSensorType(sensorTypeId); // Set the selected sensor type
  };

  const fetchBabies = async (supervisorId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/baby/supervisor/${supervisorId}`);
      if (response.ok) {
        const data = await response.json();
        setBabies(data);
      } else {
        console.error('Failed to fetch babies');
      }
    } catch (error) {
      console.error('Error fetching babies:', error);
    }
  };

  const fetchIncubatorByBabyId = async (babyId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/baby/incubator/${babyId}`);
      console.log(babyId)
      if (response.ok) {
        const data = await response.json();
        setSelectedIncubatorId(data.incubatorId); // Set the selected incubatorId
      } else {
        console.error('Failed to fetch incubator by babyId');
      }
    } catch (error) {
      console.error('Error fetching incubator by babyId:', error);
    }
  };

  const fetchSensorTypes = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/sensor-types');
      if (response.ok) {
        const data = await response.json();
        setSensorTypes(data);
      } else {
        console.error('Failed to fetch Sensor Types');
      }
    } catch (error) {
      console.error('Error fetching Sensor Types:', error);
    }
  };

  useEffect(() => {
    const supervisorId = Cookies.get('supervisorId');
    fetchBabies(supervisorId);
    fetchSensorTypes();
  }, []);

  const handleBabySelection = (event) => {
    setSelectedBaby(event.target.value); // Update the selected baby
    fetchIncubatorByBabyId(event.target.value); // Fetch the incubator associated with the selected baby
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedSensorType && selectedBaby && selectedIncubatorId) {
      // Construct the path based on the selected sensor type and incubator ID
      let path = `/${selectedSensorType}/${selectedIncubatorId}`;
  
      // Redirect to the corresponding sensor page
      navigate(path);
    }
  };
  

  return (
    <>
      <NavbarDoctor />
      <NotificationService />
      <div className="background-image-sensors">
        <Link to={'https://www.arduino.cc/en/Guide/Introduction'}>
          <div className="dashboard-arduino">
            <img src={clickableImageArduino} alt="Arduino" />
          </div>
        </Link>
        <div className="sensor-types-container">
          <h2>Sensors</h2>
          <ul>
            {sensorTypes.map((sensor) => (
              <li key={sensor.sensorTypeId}>
                <button className="baby-redirect" onClick={() => redirectToSensorType(sensor.sensorTypeId)}>
                  {sensor.typeName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedSensorType && (
        <div className='backdrop'>
        <div className="baby-selection-form">
          <h3>Select a Baby:</h3>
          <form onSubmit={handleSubmit}>
            <select onChange={handleBabySelection}>
              <option value="">Select a Baby</option>
              {babies.map((baby) => (
                <option key={baby.babyId} value={baby.babyId}>
                  {baby.babyName}
                </option>
              ))}
            </select>
            <button className='baby-selection-form-button' type="submit">Go</button>
          </form>
        </div>
        </div>
      )}
    </>
  );
};

export default Sensors;
