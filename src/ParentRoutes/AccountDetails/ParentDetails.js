import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../DoctorRoutes/Account Details/AccountDetails.css';
import AlertModal from '../../AlertModal/AlertModal'; 
import NavbarParent from '../NavbarParent/NavbarParent';
import NavbarDoctor from '../../DoctorRoutes/NavbarDoctor/NavbarDoctor';
import Cookies from 'js-cookie';
import NotificationService from '../../NotificationService/NotificationService';

function ParentAccount() {
  const [parentDetails, setParentDetails] = useState({
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

  const [babyDetails, setBabyDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [parentId, setParentId] = useState('');
  const [supervisorIds, setSupervisorIds] = useState([]);
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

useEffect(() => {
  fetchUserRole();
}, []);


  useEffect(() => {
    fetchParentDetails();
  }, []);

  useEffect(() => {
    if (parentId) {
      fetchParentBabies();
    }
  }, [parentId]);

  const fetchParentDetails = async () => {
    const userId = Cookies.get('userId');
    const userRole = Cookies.get('userRole');

    if (!userId || userRole !== 'parent') {
      console.error('Invalid user or role');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/details/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setParentDetails(data);
    
        const parentResponse = await fetch(`http://localhost:8081/api/parents/${userId}`);
        if (parentResponse.ok) {
          const parentData = await parentResponse.json();
          setParentId(parentData.parentId);
        } else {
          console.error('Failed to fetch parent details');
        }
      } else {
        console.error('Failed to fetch parent details');
      }
    } catch (error) {
      console.error('Error fetching parent details:', error);
    }
  };

  const fetchParentBabies = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/parents/myBabies/${parentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBabyDetails(data); 
        const supervisorIds = data.map(baby => baby.supervisorId);
        setSupervisorIds(supervisorIds);
        console.log(supervisorIds);
      } else {
        console.error('Failed to fetch babies');
      }
    } catch (error) {
      console.error('Error fetching babies:', error);
    }
  };

  const handleUpdateParentDetails = async () => {
    const userId = Cookies.get('userId');

    try {
      const response = await fetch(`http://localhost:8081/api/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parentDetails),
      });
      if (response.ok) {
        console.log('Parent details updated successfully');
        setIsEditing(false); 
      } else {
       
        setAlertMessage('Failed to update parent details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating parent details:', error);

      setAlertMessage('Error updating parent details. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCloseAlert = () => {
    setAlertMessage('');
  };

  const handleSupervisorClick = (supervisorId) => {
    navigate(`/supervisor/${supervisorId}`);
  };

  return (
    <>
      {role === "parent" ? <NavbarParent /> : <NavbarDoctor />}
      <NotificationService />
      <div className="background-image-details-parent"></div>
      <div className="doctor-account-container">
        <h1 className='custom-text'>{parentDetails.firstName} {parentDetails.lastName}</h1>
        {isEditing ? (
          <div className="account-form">
            <div className="column">
              <input
                type="text"
                name="username"
                value={parentDetails.username}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="password"
                value={parentDetails.password}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="firstName"
                value={parentDetails.firstName}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="lastName"
                value={parentDetails.lastName}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="email"
                name="email"
                value={parentDetails.email}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="telephone"
                value={parentDetails.telephone}
                onChange={handleChange}
                className='input-container-details'
                required
              />
            </div>
            <div className="column">
              <input
                type="text"
                name="country"
                value={parentDetails.country}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="city"
                value={parentDetails.city}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="street"
                value={parentDetails.street}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="number"
                value={parentDetails.number}
                onChange={handleChange}
                className='input-container-details'
                required
              />
            </div>
            <button onClick={handleUpdateParentDetails}>Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div className="details-view">
            <h2>My Details</h2>
            <p><strong>Username:</strong> {parentDetails.username}</p>
            <p><strong>First Name:</strong> {parentDetails.firstName}</p>
            <p><strong>Last Name:</strong> {parentDetails.lastName}</p>
            <p><strong>Email:</strong> {parentDetails.email}</p>
            <p><strong>Telephone:</strong> {parentDetails.telephone}</p>
            <p><strong>Country:</strong> {parentDetails.country}</p>
            <p><strong>City:</strong> {parentDetails.city}</p>
            <p><strong>Street:</strong> {parentDetails.street}</p>
            <p><strong>Number:</strong> {parentDetails.number}</p>
            <button className="update-details-button" onClick={() => setIsEditing(true)}>Update Details</button>
          </div>
        )}
      </div>
      {babyDetails.map(baby => (
        <div key={baby.id} className="details-view-2">
          <h2>Baby Details</h2>
          <p><strong>Baby Name:</strong> {baby.babyName}</p>
          <p><strong>CNP:</strong> {baby.cnp}</p>
          <p><strong>Weight:</strong> {baby.weight} kg</p>
          <p><strong>Height:</strong> {baby.height} cm</p>
          <p><strong>Gender:</strong> {baby.gender}</p>
          <p>
            <strong>Supervisor's Name:</strong> 
            <button className='update-details-button-2' onClick={() => handleSupervisorClick(baby.supervisorId)}>
              {baby.supervisorName}
            </button>
          </p>
        </div>
      ))}

      {alertMessage && <AlertModal message={alertMessage} onClose={handleCloseAlert} />}
    </>
  );
}

export default ParentAccount;
