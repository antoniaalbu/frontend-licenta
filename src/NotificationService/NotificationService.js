import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import NotificationModal from '../NotificationModal/NotificationModal';

const NotificationService = () => {
    const [alertMessage, setAlertMessage] = useState('');
    const [sensorTypeMsg, setSensorType] = useState('');
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [babyId, setBabyId] = useState(null); // State to hold babyId

    const handleAlert = (message, babyId) => {
        setAlertMessage(message);
        setBabyId(babyId); // Set the babyId in state
        setShowAlertModal(true);
    };

    const closeAlertModal = () => {
        setShowAlertModal(false);
    };

    useEffect(() => {
        // WebSocket connection
        const socket = new SockJS('http://localhost:8081/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');

                // Subscribe to '/topic/alert'
                client.subscribe('/topic/alert', message => {
                    const alertMessage = JSON.parse(message.body); // Parse the JSON string
                    const { message: alertMsg, babyId } = alertMessage; // Extract babyId
                    handleAlert(alertMsg, babyId); // Access the message field and babyId
                    console.log(alertMessage);
                });

                // Subscribe to '/topic/sensorType'
                client.subscribe('/topic/sensorType', sensorType => {
                    const sensorTypeMsg = sensorType.body;
                    console.log(sensorTypeMsg);
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
            }
        });

        client.activate();

        // Cleanup on component unmount
        return () => {
            client.deactivate();
        };
    }, []);

    return (
        <>
            {showAlertModal && <NotificationModal message={alertMessage} babyId={babyId} type={sensorTypeMsg} onClose={closeAlertModal} />}
        </>
    );
};

export default NotificationService;
