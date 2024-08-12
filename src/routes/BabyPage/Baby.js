import React from 'react';
import './Baby.css'; 
import Navbar from '../Navbar/Navbar';
import clickableImage from '../../assets/incubator.jpg'; 
import { Link } from 'react-router-dom';

const Baby = () => {
  return (
    <>
    <Navbar />
    <div className="container-baby">
        <div className="background-container-baby">
          <div className="background-image-baby-1">
          
          <Link to="/doctorPage">
          <div className="gif-background-baby"></div>
          </Link>
          
          <Link to="/incubator">
              <div className="clickable-picture-baby">
                <img src={clickableImage} alt="Clickable Image" title="Read about our Incubator" />
              </div>
          </Link>

          </div>
          
            
        </div>
     
    </div>
    </>
  );
}

export default Baby;
