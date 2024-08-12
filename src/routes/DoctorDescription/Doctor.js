import React, { useState } from 'react';
import './Doctor.css'; 
import Navbar from '../Navbar/Navbar';
import doctorImage from '../../assets/doctor_heart.jpeg'; 
import slideImage1 from '../../assets/family.jpg'; 
import slidingImage1 from '../../assets/doctor_heart2.jpg'

const Doctors = () => {
  const [slidePosition, setSlidePosition] = useState(0);
  const [verticalPosition, setVerticalPosition] = useState(0);

  const handleImageClick = () => {
  
    setSlidePosition(prevPosition => (prevPosition === 0 ? -700 : 0)); 
  };

  return (
    <>
      <Navbar />
      <div className="container-doctor">
        <div className="background-container-doctor">
          <div className="background-image-doctors-1"></div>
          <div className="background-image-doctors-2">
          <div className="sliding-image-container-doctor">
              <img src={slidingImage1} alt="Sliding Image" className="sliding-image-doctor-1" style={{width: '500px'}} />
          </div>
          </div>
          <div className="doctor-image">
            <img src={doctorImage} alt="Doctor Image" style={{ width: '760px', borderRadius: '20px' }} />
          </div>
          <div 
            className="slide-image" 
            onClick={handleImageClick} 
            style={{ 
              transform: `translate(${slidePosition}px, ${verticalPosition}px)`
            }}
          >
            <img src={slideImage1} alt="Slide Image" style={{ width: '685px' }} />
          </div>
          
         
        </div>
      </div>
    </>
  );
}

export default Doctors;