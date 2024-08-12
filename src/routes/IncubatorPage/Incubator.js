import React, { useEffect } from 'react';
import './Incubator.css'; 
import Navbar from '../Navbar/Navbar';
import clickableImage from '../../assets/doctor1.jpg'; 
import clickableImageArduino from '../../assets/arduino.png'; 
import slidingImage from '../../assets/ad8232.jpg';
import { Link } from 'react-router-dom';

const Incubator = () => {
  
  return (
    <>
      <Navbar />
      <div className="container-incubator">
        <div className="background-container-incubator">
          <div className="background-image-incubator-1">
            <Link to="https://www.arduino.cc/en/Guide/Introduction">
              <div className="clickable-picture-arduino">
                <img src={clickableImageArduino} alt="Clickable Image" title="Read about Arduino" />
              </div>
            </Link>
            <a href="https://www.elprocus.com/a-brief-on-dht11-sensor/" target="_blank" rel="noopener noreferrer" className="image-link">
              {"Read more about the DHT11 sensor"}
            </a>
          </div>
          <div className="background-image-incubator-2">
          <Link to="https://www.analog.com/en/products/ad8232.html">
            <div className="sliding-image-container">
              <img src={slidingImage} alt="Sliding Image" className="sliding-image" />
            </div>
          </Link>
            <Link to="/doctorPage">
              <div className="clickable-picture">
                <img src={clickableImage} alt="Clickable Image" title="Visit Doctor's Page" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Incubator;
