import React, { useState, useEffect } from 'react';
import './IncubatorOp.css';
import { useParams, useNavigate } from 'react-router-dom'; 
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import AlertModal from '../../AlertModal/AlertModal';
import RedirectModal from '../../RedirectModal/RedirectModal';
import NotificationService from '../../NotificationService/NotificationService';
import NavbarParent from '../../ParentRoutes/NavbarParent/NavbarParent';
import Cookies from 'js-cookie';

const IncubatorOp = () => {
  const { incubatorId, babyId, babyName } = useParams();
  const [role, setRole] = useState("");
  const navigate = useNavigate(); 
  const [incubator, setIncubator] = useState(null);
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isOccupied, setIsOccupied] = useState('');

  useEffect(() => {
    fetchIncubator();
  }, [incubatorId]);

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

useEffect(() => {
  fetchUserRole();
}, []);


  const fetchIncubator = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/incubators/${incubatorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch incubator');
      }
      const data = await response.json();
      setIncubator(data);
      setIsOccupied(data.occupied);
    } catch (error) {
      console.error('Error fetching incubator:', error);
    }
  };

  const handleDeleteIncubator = async () => {
    try {
      const availableIncubatorsResponse = await fetch('http://localhost:8081/api/incubators/available');
      
      if (!availableIncubatorsResponse.ok) {
        throw new Error('Failed to fetch available incubators');
      }

      const availableIncubatorsText = await availableIncubatorsResponse.text();

      if (availableIncubatorsText.length === 0) {
        setErrorMessage('Cannot delete incubator because there are no available ones to reassign the babies.');
        return;
      }

      const deleteResponse = await fetch(`http://localhost:8081/api/incubators/delete/${incubatorId}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        if (deleteResponse.status === 400) {
          setErrorMessage('Failed to delete incubator: There are no available incubators to reassign babies!');
        } else {
          throw new Error('Failed to delete incubator');
        }
      } else {
        if (incubator.occupied) { 
          navigate(`/babies/${babyId}/${babyName}`);
        } else {
          navigate(`/incubatorPage`); 
        }
      }
    } catch (error) {
      console.error('Error deleting incubator:', error);
    }
  };

  const handleUpdateIncubator = async () => {
    try {
      if (!location.trim()) {
       
        return;
      }

      await fetch(`http://localhost:8081/api/incubators/update/${incubatorId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      });

     

      setLocation('');
      fetchIncubator(); 
    } catch (error) {
      console.error('Error updating incubator:', error);
    }
  };

  const closeModal = () => {
    navigate('/incubatorPage');
  };

  return (
    <>
      {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
      <NotificationService />
      <div className="background-image-incu">
        <div className="incubator-container-incubator">
          <div className="incubator-details">
            <h2>Incubator Details</h2>
  
            {incubator && (
              <>
                <p>ID: {incubator.incubatorId}</p>
                <p>Location: {incubator.location}</p>
                <p>Occupied: {incubator.occupied ? 'Yes' : 'No'}</p> 
              </>
            )}
          </div>

          <div className="delete-incubator-incu">
            <h2>Delete Incubator with ID {incubatorId}</h2>
            {incubator && (
              <button className="delete-button-incu" onClick={handleDeleteIncubator}>Delete</button>
            )}
          </div>

          <div className="update-incubator-incu">
            <h2>Update Incubator</h2>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Location"
              className='input-update-incu'
            />
            <button className="update-button-incu" onClick={handleUpdateIncubator}>Update</button>
          </div>
         
        </div>
      </div>
      {errorMessage && (
        <RedirectModal message={errorMessage} onClose={closeModal} /> 
      )}
    </>
  );
};

export default IncubatorOp;
