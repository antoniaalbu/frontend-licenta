import React, {useState, useEffect} from 'react';
import '../../DoctorRoutes/Sensors/Sensors.css';
import NavbarParent from '../NavbarParent/NavbarParent';
import NavbarDoctor from '../../DoctorRoutes/NavbarDoctor/NavbarDoctor';
import clickableImageArduino from '../../assets/arduino.png';
import './SensorParent.css'
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const DashboardParent = () => {
  
  const { incubatorId, babyId, babyName } = useParams();
  const [soilHumidity, setSoilHumidity] = useState(null);
  const [microphone, setMicrophone] = useState(null);
  const [airHumidity, setAirHumidity] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [bodyTemp, setBodyTemp] = useState(null);
 

  useEffect(() => {
    const fetchSoilHumidity = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/sensor-data/latestRead/2`); 
        if (!response.ok) {
          throw new Error('Failed to fetch soil humidity data');
        }
        const sensorData = await response.json();
        setSoilHumidity(sensorData.value + ' %');
        console.log(sensorData.value)
      } catch (error) {
        console.error('Error fetching soil humidity data:', error);
      }
    };

    const fetchMicrophoneData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/sensor-data/latestRead/3`); 
        if (!response.ok) {
          throw new Error('Failed to fetch soil microphone');
        }
        const sensorData = await response.json();
        if(sensorData.value > 750){
          setMicrophone('The baby is crying!');
        }
        else{
          setMicrophone('No loud noises detected');
        }
        
        console.log(sensorData.value)
      } catch (error) {
        console.error('Error fetching microphone data:', error);
      }
    };

    const fetchAirHumidityData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/sensor-data/latestRead/5`); 
        if (!response.ok) {
          throw new Error('Failed to fetch soil microphone');
        }
        const sensorData = await response.json();
        setAirHumidity(sensorData.value + ' %');
        console.log(sensorData.value)
      } catch (error) {
        console.error('Error fetching microphone data:', error);
      }
    };

    const fetchTemperatureData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/sensor-data/latestRead/4`); 
        if (!response.ok) {
          throw new Error('Failed to fetch soil microphone');
        }
        const sensorData = await response.json();
        setTemperature(sensorData.value + ' °C');
        console.log(sensorData.value)
      } catch (error) {
        console.error('Error fetching microphone data:', error);
      }
    };

    const fetchBodyTemp= async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/sensor-data/latestRead/6`); 
        if (!response.ok) {
          throw new Error('Failed to fetch soil microphone');
        }
        const sensorData = await response.json();
        setBodyTemp(sensorData.value + '°C');
        console.log(sensorData.value)
      } catch (error) {
        console.error('Error fetching microphone data:', error);
      }
    };

    fetchSoilHumidity();
    fetchMicrophoneData();
    fetchAirHumidityData();
    fetchBodyTemp();
    fetchTemperatureData();
  }, []);

  const [role, setRole] = useState(""); 

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
  };

  
  return (
    <>
     {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
      <div className="background-image-dashboard-parent">
      

       
          <h2>Show Sensor Dashboard</h2>
          <Link to={`/4/${incubatorId}`}>
            <div className="sensor temperature">
              <h2>Temperature</h2>
              <p>{temperature || 'Loading...'}</p>
            </div>
          </Link>
          <Link to={`/5/${incubatorId}`}>
            <div className="sensor humidity">
              <h2>Humidity</h2>
              <p>{airHumidity || 'Loading...'}</p>
            </div>
          </Link>
          <Link to={`/3/${incubatorId}`}>
            <div className="sensor microphone">
              <h2>Microphone</h2>
              <p>{microphone || 'Loading...'}</p>
            </div>
          </Link>
       

          <Link to={`/1/${incubatorId}`}>
            <div className="sensor ecg">
              <h2>ECG Sensor</h2>
              <p>{'Normal heartbeat'}</p>
            </div>
          </Link>
          <Link to={`/2/${incubatorId}`}>
            <div className="sensor soilHumidity">
              <h2>Pampers Humidity</h2>
              <p>{soilHumidity || 'Loading...'}</p>
            </div>
          </Link>
          <Link to={`/6/${incubatorId}`}>
            <div className="sensor babyTemp">
              <h2>Body Temperature</h2>
              <p>{bodyTemp || 'Loading...'}</p>
            </div>
          </Link>
        </div>
      
    </>
  );
};

export default DashboardParent;
