import React, { useState, useEffect } from 'react';
import './Notifications.css';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import NavbarDoctor from '../DoctorRoutes/NavbarDoctor/NavbarDoctor';
import NavbarParent from '../ParentRoutes/NavbarParent/NavbarParent';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterTimestamp, setFilterTimestamp] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const fetchUserRole = () => {
    const userRole = Cookies.get('userRole');
    setRole(userRole);
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/notifications/withBabyId/17');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
        setFilteredNotifications(data); // Initialize filtered notifications
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    const socket = new SockJS('http://localhost:8081/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');

        client.subscribe('/topic/alert', message => {
          const alertMessage = JSON.parse(message.body);
          setNotifications(prevNotifications => [alertMessage, ...prevNotifications]);
          setFilteredNotifications(prevNotifications => [alertMessage, ...prevNotifications]);
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

  const handleNotificationClick = sensorType => {
    switch (sensorType) {
      case "Diaper Humidity":
        navigate('/sensors/2');
        break;
      case "Microphone":
        navigate('/sensors/3');
        break;
      case "Temperature":
        navigate('/sensors/4');
        break;
      case "Air Humidity":
        navigate('/sensors/5');
        break;
      case "Body Temperature":
        navigate('/sensors/6');
        break;
      default:
        break;
    }
  };

  const handleDeleteNotification = async id => {
    try {
      const response = await fetch(`http://localhost:8081/api/notifications/deleteById/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      setNotifications(prevNotifications => prevNotifications.filter(notification => notification[0] !== id));
      setFilteredNotifications(prevNotifications => prevNotifications.filter(notification => notification[0] !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications]; // Create a new array to avoid mutating state

    if (filterType) {
      filtered = filtered.filter(notification =>
        notification[3].toLowerCase().includes(filterType.toLowerCase()) // Assuming index 3 is sensorType
      );
    }

    if (filterTimestamp) {
      filtered = filtered.filter(notification =>
        new Date(notification[2]).toString() !== 'Invalid Date' &&
        new Date(notification[2]) >= new Date(filterTimestamp) // Assuming index 2 is timestamp
      );
    }

    // Sort filtered notifications by timestamp in descending order (newest first)
    filtered.sort((a, b) => new Date(b[2]) - new Date(a[2])); // Assuming index 2 is timestamp

    setFilteredNotifications(filtered);
  };

  useEffect(() => {
    filterNotifications();
  }, [filterType, filterTimestamp, notifications]);

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/notifications/deleteAll', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete all notifications');
      }
      setNotifications([]);
      setFilteredNotifications([]);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  return (
    <>
      {role === 'doctor' ? <NavbarDoctor /> : <NavbarParent />}
      <div className="background-image-notif">
        <div className="notifications">
          <div className="filters">
            <input
              type="text"
              placeholder="Filter by sensor type"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="filter-type"
            />
            <input
              type="datetime-local"
              placeholder="Filter by timestamp"
              value={filterTimestamp}
              onChange={e => setFilterTimestamp(e.target.value)}
              className="filter-time"
            />
          </div>
          <div className="notification-list">
            <div className="notification-container">
              {filteredNotifications.map(notification => (
                <div key={notification[0]} className="notification"> {/* Assuming index 0 is id */}
                  <button className="delete-notif-by-Id" onClick={() => handleDeleteNotification(notification[0])}>
                    X
                  </button>
                  <div onClick={() => handleNotificationClick(notification[3])}> {/* Assuming index 3 is sensorType */}
                    <p>{notification[1]}</p> {/* Assuming index 1 is message */}
                    <p><strong>Sensor Type:</strong> {notification[3]}</p> {/* Assuming index 3 is sensorType */}
                    <p><strong>Timestamp:</strong> {new Date(notification[2]).toLocaleString()}</p> {/* Assuming index 2 is timestamp */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="delete-notif" onClick={handleDeleteAll}>Delete Your Inbox</button>
        </div>
      </div>
    </>
  );
};

export default Notifications;
