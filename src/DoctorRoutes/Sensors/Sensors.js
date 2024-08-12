import React, { useState, useEffect, useRef } from 'react';
import './Sensors.css';
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import NavbarParent from '../../ParentRoutes/NavbarParent/NavbarParent';
import clickableImageArduino from '../../assets/incubatorDash.webp';
import { Link, useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client'; 
import AlertModal from '../../AlertModal/AlertModal'; 
import NotificationService from '../../NotificationService/NotificationService';
import NotificationModal from '../../NotificationModal/NotificationModal';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const { incubatorId, babyId, babyName } = useParams();
  const [soilHumidity, setSoilHumidity] = useState(null);
  const [microphone, setMicrophone] = useState(null);
  const [ecg, setEcg] = useState(null);
  const [airHumidity, setAirHumidity] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [bodyTemp, setBodyTemp] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [role, setRole] = useState("");

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

useEffect(() => {
  fetchUserRole();
}, []);



  useEffect(() => {
   
  
    const fetchSoilHumidity = async () => {

      try {
        const response = await fetch(`http://localhost:8081/api/sensor-data/latestRead/2`);
        if (!response.ok) {
          throw new Error('Failed to fetch soil humidity data');
        }
        const sensorData = await response.json();
        setSoilHumidity(sensorData.value + ' %');
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
        if(sensorData.value > 700){
          setMicrophone('The Baby is Crying!');
        }
        else{
          setMicrophone('No loud sounds detected!');
        }
       
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
        setTemperature(sensorData.value + '°C');
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
        setBodyTemp(sensorData.value + ' °C');
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


    const socket = new SockJS('http://localhost:8081/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');

        client.subscribe('/topic/sensorData', message => {
          const data = JSON.parse(message.body);
          if (data.sensorId === 2) {
            setSoilHumidity(data.value);
          }
          if (data.sensorId === 3) {
            setMicrophone(data.value);
          }
        });

        
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);


  const [showDashboard1, setShowDashboard1] = useState(false);
  const [showDashboard2, setShowDashboard2] = useState(false);
  const arduinoImageRef = useRef(null);

  const toggleDashboard1 = () => {
    setShowDashboard1(!showDashboard1);
  };

  const toggleDashboard2 = () => {
    setShowDashboard2(!showDashboard2);
  };



  const closeAlertModal = () => {
    setShowAlertModal(false); 
  };

  return (
    <>
      {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
      <NotificationService />
      <div className="background-image-dashboard">
        <div className="welcome-message">
          {`Access Data for Incubator ${incubatorId}`}
        </div>
        <div className="baby-message">
          {`Home for Baby ${babyName}`}
        </div>
        <Link to={`/incubatorOp/${incubatorId}/${babyId}/${babyName}`}>
          <div className="dashboard-inc">
            <img src={clickableImageArduino} alt="Arduino" />
          </div>
        </Link>

        <button className="show-incubator-button-1" onClick={toggleDashboard1}>
          {showDashboard1 ? 'Close Dashboard 1' : 'Show Incubator Dashboard'}
        </button>
        <button className="show-baby-button-1" onClick={toggleDashboard2}>
          {showDashboard2 ? 'Close Dashboard 2' : 'Show Baby Dashboard'}
       
          </button>

<div className={`dashboard ${showDashboard1 ? 'show' : ''}`} id="dashboard1">
  
  <Link to={`/4/${incubatorId}`}>
    <div className="sensor temperature">
      <h2>Temperature</h2>
      <p>{temperature || 'Loading...'}</p>
    </div>
  </Link>
  <Link to={`/5/${incubatorId}`}>
    <div className="sensor humidity">
      <h2>Air Humidity</h2>
      <p>{airHumidity || 'Loading...'}</p>
    </div>
  </Link>
  <Link to={`/3/${incubatorId}`}>
    <div className="sensor microphone">
      <h2>Microphone</h2>
      <p>{microphone || 'Loading...'}</p>
    </div>
  </Link>
<button className='button-dash' onClick={toggleDashboard1}>X</button>
</div>

<div className={`dashboard ${showDashboard2 ? 'show' : ''}`} id="dashboard2">
  <button className="button-dash" onClick={toggleDashboard2}>X</button>
  <Link to={`/ps5`}>
    <div className="sensor ecg">
      <h2>ECG Sensor</h2>
      <p>{ 'Normal heartbeat'}</p>
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
      <h2>Baby Temperature</h2>
      <p>{bodyTemp || 'Loading...'}</p>
    </div>
  </Link>
</div>
</div>

{showAlertModal && <NotificationModal message={alertMessage} onClose={closeAlertModal} />}
</>
);
};

export default Dashboard;
