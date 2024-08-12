import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Charts.css';
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import NavbarParent from '../../ParentRoutes/NavbarParent/NavbarParent';
import Cookies from 'js-cookie';
import NotificationService from '../../NotificationService/NotificationService';

const HumidityGraphic = () => {
    const [data, setData] = useState([]);
    const [role, setRole] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const fetchUserRole = () => {
        const userRole = Cookies.get("userRole");
        setRole(userRole);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000); 
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${formattedDate} ${formattedTime}`;
    };

    const fetchSensorData = async () => {
        try {
            const sensorId = 5; 
            let url = `http://localhost:8081/api/sensor-data/${sensorId}`;

            if (startTime && endTime) {
                url += `/${Math.floor(startTime.getTime() / 1000)}/${Math.floor(endTime.getTime() / 1000)}`;
            } else {
                const now = Math.floor(Date.now() / 1000); 
                const oneHourAgo = now - 3600; 
                url += `/${oneHourAgo}/${now}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch sensor data');
            }
            const sensorData = await response.json();

            const formattedData = sensorData.map(item => ({
                ...item,
                timestamp: Math.floor(new Date(item.timestamp).getTime() / 1000) 
            }));

            setData(formattedData || []);
            console.log('Sensor data:', formattedData); 
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };

    const handleStartTimeChange = (event) => {
        const value = event.target.value;
        const date = new Date(value);
        setStartTime(date);
    };

    const handleEndTimeChange = (event) => {
        const value = event.target.value;
        const date = new Date(value);
        setEndTime(date);
    };

    useEffect(() => {
        fetchUserRole();
    }, []);

    useEffect(() => {
        fetchSensorData();
    }, [startTime, endTime]);

    return (
        <>
            {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
            <NotificationService />
            <div className="chart-container">
                <div className="filters-container">
                    <h2>Air Humidity</h2>
                    <div className="filter">
                        <label htmlFor="startTime">Filter based on Start Time:</label>
                        <input type="datetime-local" id="startTime" name="startTime" onChange={handleStartTimeChange} />
                    </div>
                    <div className="filter">
                        <label htmlFor="endTime">Filter based on End Time:</label>
                        <input type="datetime-local" id="endTime" name="endTime" onChange={handleEndTimeChange} />
                    </div>
                </div>
                <div className="chart-wrapper">
                    <LineChart
                        width={800}
                        height={500}
                        data={data}
                        margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                        style={{ margin: 'auto' }}
                    >
                        <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
                        <YAxis dataKey="value" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip labelFormatter={formatTimestamp} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                </div>
            </div>
        </>
    );
};

export default HumidityGraphic;
