import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Papa from 'papaparse';
import NavbarDoctor from '../../DoctorRoutes/NavbarDoctor/NavbarDoctor';
import NavbarParent from '../../ParentRoutes/NavbarParent/NavbarParent';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import './EcgVisualiser.css'

const EcgChart = () => {
  const [chart, setChart] = useState(null);
  const canvasRef = useRef(null);
  const location = useLocation();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (location.pathname === '/ecgVisualiser') {
      // Initialize chart when on the ECG visualizer page
      const ctx = canvasRef.current;
      if (!ctx) {
        console.error("Canvas context is not available");
        return;
      }

      const newChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'ECG Data',
            data: [],
            borderColor: 'blue',
            borderWidth: 1,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            pointHitRadius: 0
          }]
        },
        options: {
          animation: {
            duration: 0
          },
          scales: {
            x: {
              display: false
            },
            y: {
              min: 0,
              max: 1023,
              ticks: {
                display: false
              }
            }
          }
        }
      });

      setChart(newChart);

      return () => {
        // Destroy chart when leaving the ECG visualizer page
        if (newChart) {
          newChart.destroy();
        }
      };
    } else {
      // If not on the ECG visualizer page, destroy the chart if it exists
      if (chart) {
        chart.destroy();
        setChart(null);
      }
    }
  }, [location]);

  

  const addData = (data) => {
    if (chart) {
      console.log("Parsed Data from addData:", data); 
      chart.data.labels = Array.from({ length: data.length }, (_, i) => i);
      chart.data.datasets[0].data = data;
      chart.update();
    }
};


const fetchCsvData = () => {
  fetch('ecg_data.csv')
    .then(response => response.text())
    .then(text => {
      console.log("CSV Text:", text); // Log the raw CSV text
      const lines = text.trim().split('\n');
      const chunkSize = 100; // Number of data points to process in each chunk
      let currentIndex = 0;

      const processChunk = () => {
        const chunk = lines.slice(currentIndex, currentIndex + chunkSize);
        const data = chunk.map(line => {
          const value = parseInt(line.trim(), 10);
          return isNaN(value) ? null : value;
        }).filter(value => value !== null);
        console.log("Parsed Data from fetchCsvData:", data);
        addData(data);

        currentIndex += chunkSize;
        if (currentIndex < lines.length) {
          setTimeout(processChunk, 1000); // Adjust interval as needed
        }
      };

      processChunk();
    })
    .catch(error => {
      console.error("Error fetching CSV data:", error);
    });
};

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
    console.log("User Role:", userRole);
  };

  useEffect(() => {
    fetchUserRole();
    if (chart) {
      fetchCsvData();
    }
  }, [chart]);

  return (
    <>
      {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
     
    <div className="chart-container">
      {location.pathname === '/ecgVisualiser' && (
        <canvas ref={canvasRef} id="ecgChart" width="800" height="500"></canvas>
      )}
    </div>
    </>
  );
};

export default EcgChart;
