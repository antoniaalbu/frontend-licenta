import React, { useState, useEffect } from 'react';
import './AccountDetails.css';
import AlertModal from '../../AlertModal/AlertModal'; 
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import NavbarParent from '../../ParentRoutes/NavbarParent/NavbarParent';
import NotificationService from '../../NotificationService/NotificationService';
import Cookies from 'js-cookie';

function DoctorAccount() {
  const [doctorDetails, setDoctorDetails] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    country: '',
    city: '',
    street: '',
    number: ''
  });
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchDoctorDetails();
  }, []);

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

  const fetchDoctorDetails = async () => {
    const userId = Cookies.get('userId');
    const userRole = Cookies.get('userRole');

    if (!userId || userRole !== 'doctor') {
      console.error('Invalid user or role');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/details/${userId}`); 
      if (response.ok) {
        const data = await response.json();
        setDoctorDetails(data);
      } else {
        console.error('Failed to fetch doctor details');
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  const handleUpdateDetails = async () => {
    const userId = Cookies.get('userId');

    try {
      const response = await fetch(`http://localhost:8081/api/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorDetails),
      });
      if (response.ok) {
        console.log('Doctor details updated successfully');
        setIsEditing(false); 
      } else {

        setAlertMessage('Username already exists!');
      }
    } catch (error) {
      console.error('Error updating doctor details:', error);
      setAlertMessage('Error updating doctor details. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCloseAlert = () => {
    setAlertMessage(''); 
  };

  useEffect(() => {
    fetchUserRole();
}, []);


  return (
    <>
      {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
      <NotificationService />
      <div className="background-image-details"></div>
     
      <div className="doctor-account-container">
        <h1 className='custom-text'>{doctorDetails.firstName} {doctorDetails.lastName}</h1>
        {isEditing ? (
          <div className="account-form">
            <div className="column">
              <input
                type="text"
                name="username"
                value={doctorDetails.username}
                onChange={handleChange}
                className='input-container-details'
                required
              />
        
              <input
              
                type="text"
                name="password"
                value={doctorDetails.password}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              
              <input
                type="text"
                name="firstName"
                value={doctorDetails.firstName}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              
              <input
                type="text"
                name="lastName"
                value={doctorDetails.lastName}
                onChange={handleChange}
                className='input-container-details'
                required
              />
             
              <input
                type="email"
                name="email"
                value={doctorDetails.email}
                onChange={handleChange}
                className='input-container-details'
                required
              />
             
              <input
                type="text"
                name="telephone"
                value={doctorDetails.telephone}
                onChange={handleChange}
                className='input-container-details'
                required
              />
            </div>
            <div className="column">
            
              <input
                type="text"
                name="country"
                value={doctorDetails.country}
                onChange={handleChange}
                className='input-container-details'
                required
              />
             
              <input
                type="text"
                name="city"
                value={doctorDetails.city}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              
              <input
                type="text"
                name="street"
                value={doctorDetails.street}
                onChange={handleChange}
                className='input-container-details'
                required
              />
             
              <input
                type="text"
                name="number"
                value={doctorDetails.number}
                onChange={handleChange}
                className='input-container-details'
                required
              />
            </div>
            <button onClick={handleUpdateDetails}>Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div className="details-view">
            <p><strong>Username:</strong> {doctorDetails.username}</p>
            <p><strong>First Name:</strong> {doctorDetails.firstName}</p>
            <p><strong>Last Name:</strong> {doctorDetails.lastName}</p>
            <p><strong>Email:</strong> {doctorDetails.email}</p>
            <p><strong>Telephone:</strong> {doctorDetails.telephone}</p>
            <p><strong>Country:</strong> {doctorDetails.country}</p>
            <p><strong>City:</strong> {doctorDetails.city}</p>
            <p><strong>Street:</strong> {doctorDetails.street}</p>
            <p><strong>Number:</strong> {doctorDetails.number}</p>
            <button className="update-details-button" onClick={() => setIsEditing(true)}>Update Details</button>
          </div>
        )}
      </div>
      {alertMessage && <AlertModal message={alertMessage} onClose={handleCloseAlert} />} 

      
    </>
  );
}

export default DoctorAccount;
