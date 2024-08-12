import React, { useState, useEffect } from 'react';
import p5 from 'p5';

const ArduinoComm = () => {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [port, setPort] = useState(null);
  const [p5Instance, setP5Instance] = useState(null); // Define p5Instance state

  const connectToSerialPort = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      const reader = port.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (p5Instance) { // Check if p5Instance is defined
          serialEvent(value);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendCommandToArduino = async (command) => {
    try {
      if (port) {
        port.write(command);
        console.log('Sent command to Arduino:', command);
      } else {
        console.error('Serial port not available');
      }
    } catch (error) {
      console.error('Error sending command to Arduino:', error);
    }
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
    sendCommandToArduino(menu); // Send selected menu command to Arduino
  };

  // Define serialEvent function to handle serial data
 // Define serialEvent function to handle serial data
const serialEvent = (data) => {
    // Convert Uint8Array to string
    const str = new TextDecoder().decode(data);
  
    // Split the string by delimiter (assuming comma in this example)
    const dataArray = str.split(',');
  
    // Parse each value in the array (assuming they're integers in this example)
    const parsedData = dataArray.map(value => parseInt(value, 10));
  
    // Your data processing logic here
    console.log('Received serial data:', parsedData);
  };
  

  useEffect(() => {
    // Initialize p5Instance when the component mounts
    const newP5Instance = new p5((p) => {
      // p5 setup function
      p.setup = () => {
        // Setup code here
        setP5Instance(p); // Set p5Instance state when it's initialized
      };
    });

    return () => {
      // Remove p5Instance when the component unmounts
      newP5Instance.remove();
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <div>
      <button onClick={connectToSerialPort}>Connect to Serial Port</button>
      <button onClick={() => handleMenuSelect('0')}>Soil Humidity</button>
      <button onClick={() => handleMenuSelect('1')}>DHT Data</button>
      <button onClick={() => handleMenuSelect('2')}>Mic Data</button>
      <button onClick={() => handleMenuSelect('3')}>ECG Data</button>
    </div>
  );
};

export default ArduinoComm;
