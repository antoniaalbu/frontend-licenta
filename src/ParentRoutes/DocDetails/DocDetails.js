import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import '../AccountDetails/ParentDetails';
import AlertModal from '../../AlertModal/AlertModal';
import NavbarParent from '../NavbarParent/NavbarParent';
import Cookies from 'js-cookie';
import NotificationService from '../../NotificationService/NotificationService';
import NavbarDoctor from '../../DoctorRoutes/NavbarDoctor/NavbarDoctor';

function DoctorDetails() {
  const { supervisorId } = useParams(); 
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
  const [alertMessage, setAlertMessage] = useState('');
  const [role, setRole] = useState("");

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

useEffect(() => {
  fetchUserRole();
}, []);


  useEffect(() => {
    if (supervisorId) {
      fetchDoctorDetails(supervisorId);
    }
  }, [supervisorId]);

  const fetchDoctorDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/details/${id}`); 
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

  const handleCloseAlert = () => {
    setAlertMessage(''); 
  };

  return (
    <>
     {role === "parent" ? <NavbarParent /> : <NavbarDoctor />}
     <NotificationService />
      <div className="background-image-details"></div>
      <div className="details-view-3">
      <h1 className='custom-text-doc'>{doctorDetails.firstName} {doctorDetails.lastName}</h1>
        <h2>Assigned Doctor Details</h2>
        
        <p><strong>First Name:</strong> {doctorDetails.firstName}</p>
        <p><strong>Last Name:</strong> {doctorDetails.lastName}</p>
        <p><strong>Email:</strong> {doctorDetails.email}</p>
        <p><strong>Telephone:</strong> {doctorDetails.telephone}</p>
      
      </div>
      {alertMessage && <AlertModal message={alertMessage} onClose={handleCloseAlert} />} 
    </>
  );
}

export default DoctorDetails;
