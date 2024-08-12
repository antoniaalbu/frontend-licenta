import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../DoctorRoutes/Account Details/AccountDetails.css';
import AlertModal from '../../AlertModal/AlertModal'; 
import NavbarParent from '../NavbarDoctor/NavbarDoctor';
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import Cookies from 'js-cookie';
import NotificationService from '../../NotificationService/NotificationService';

function ParentDetails() {
  const { parentId } = useParams(); 
  
  const [parentDetails, setParentDetails] = useState({
    user: {
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
    }
  });

  const [babyDetails, setBabyDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchParentDetails();
  }, []);

  useEffect(() => {
    if (parentId) {
      fetchParentBabies();
    }
  }, [parentId]);

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

useEffect(() => {
  fetchUserRole();
}, []);


  const fetchParentDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/parents/details/${parentId}`);
      if (response.ok) {
        const data = await response.json();
        setParentDetails(data);
        console.log(parentDetails);
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
      user: {
        ...prevDetails.user,
        [name]: value,
      }
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
      {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
      <NotificationService />
      <div className="background-image-details-parent"></div>
      <div className="doctor-account-container">
        <h1 className='custom-text'>{parentDetails.user?.firstName} {parentDetails.user?.lastName}</h1>
        {isEditing ? (
          <div className="account-form">
            <div className="column">
              <input
                type="text"
                name="firstName"
                value={parentDetails.user?.firstName}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="lastName"
                value={parentDetails.user?.lastName}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="email"
                name="email"
                value={parentDetails.user?.email}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="telephone"
                value={parentDetails.user?.telephone}
                onChange={handleChange}
                className='input-container-details'
                required
              />
            </div>
            <div className="column">
              <input
                type="text"
                name="country"
                value={parentDetails.user?.country}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="city"
                value={parentDetails.user?.city}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="street"
                value={parentDetails.user?.street}
                onChange={handleChange}
                className='input-container-details'
                required
              />
              <input
                type="text"
                name="number"
                value={parentDetails.user?.number}
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
            <p><strong>First Name:</strong> {parentDetails.user?.firstName}</p>
            <p><strong>Last Name:</strong> {parentDetails.user?.lastName}</p>
            <p><strong>Email:</strong> {parentDetails.user?.email}</p>
            <p><strong>Telephone:</strong> {parentDetails.user?.telephone}</p>
            <p><strong>Country:</strong> {parentDetails.user?.country}</p>
            <p><strong>City:</strong> {parentDetails.user?.city}</p>
            <p><strong>Street:</strong> {parentDetails.user?.street}</p>
            <p><strong>Number:</strong> {parentDetails.user?.number}</p>
          </div>
        )}
      </div>
      <div className="details-view-2">
            <h2>Baby Details</h2>
           
            {babyDetails.map(baby => (
                <div key={baby.babyId}>
                <p><strong>Baby Name:</strong> { baby.babyName} </p>
                <p><strong>CNP:</strong> {baby.cnp}</p>
                <p><strong>Weight:</strong> {baby.weight} kg</p>
                <p><strong>Height:</strong> {baby.height} cm</p>
                <p><strong>Gender:</strong> {baby.gender}</p>
                </div>
            ))}
            </div>

      {alertMessage && <AlertModal message={alertMessage} onClose={handleCloseAlert} />}
    </>
  );
}

export default ParentDetails;
