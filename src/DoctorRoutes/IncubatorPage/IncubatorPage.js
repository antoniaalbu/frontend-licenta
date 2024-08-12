import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import NavbarParent from '../../ParentRoutes/NavbarParent/NavbarParent';
import '../IncubatorOp/IncubatorOp.css';
import AlertModal from '../../AlertModal/AlertModal'; 
import Cookies from 'js-cookie';
import NotificationService from '../../NotificationService/NotificationService';

const IncubatorsPage = () => {
  const [incubators, setIncubators] = useState([]);
  const [location, setLocation] = useState('');
  const [selectedIncubatorId, setSelectedIncubatorId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const supervisorId = Cookies.get("supervisorId");
  const [babies, setBabies] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchIncubators();
    fetchBabies(supervisorId);
  }, []);

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

useEffect(() => {
  fetchUserRole();
}, []);


  const fetchIncubators = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/incubators');
      if (!response.ok) {
        throw new Error('Failed to fetch incubators');
      }
      const data = await response.json();
      setIncubators(data);
    } catch (error) {
      console.error('Error fetching incubators:', error);
    }
  };

  const fetchBabies = async (supervisorId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/baby/supervisor/${supervisorId}`);
      if (response.ok) {
        const data = await response.json();
        setBabies(data);
        console.log(babies)
        
      } else {
        console.error('Failed to fetch babies');
      }
    } catch (error) {
      console.error('Error fetching babies:', error);
    }
  };


  const handleDeleteIncubator = async (incubatorId) => {
    try {
      const availableIncubatorsResponse = await fetch('http://localhost:8081/api/incubators/available');
      
      if (!availableIncubatorsResponse.ok) {
        throw new Error('Failed to fetch available incubators');
      }

      const availableIncubatorsText = await availableIncubatorsResponse.text();

      if (availableIncubatorsText.length === 0) {
        setErrorMessage('Cannot delete incubator because there are no available ones to reassign the babies.');
      } else {
        setTimeout(() => {
          fetchIncubators();
        }, 500);
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
      }

    } catch (error) {
      console.error('Error deleting incubator:', error);
    }
  };

  const handleUpdateIncubator = async () => {
    if (!location.trim() || !selectedIncubatorId) {
      return;
    }
    try {
      await fetch(`http://localhost:8081/api/incubators/update/${selectedIncubatorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      });
      setLocation('');
      setSelectedIncubatorId(null);
      fetchIncubators();
    } catch (error) {
      console.error('Error updating incubator:', error);
    }
  };

  const handleAddIncubator = async () => {
    try {
      if (!location.trim()) {
        
        return;
      }

      await fetch(`http://localhost:8081/api/incubators`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      });

      fetchIncubators();
      setLocation('');
    } catch (error) {
      console.error('Error adding incubator:', error);
    }
  };

  const redirectToIncubator = (babyId, babyName, babyInc) => {
    console.log(babyId)
    navigate(`/incubatorOp/${babyInc}/${babyId}/${babyName}`);
  };

  const closeModal = () => {
    setErrorMessage('');
  };

  return (
    <>
      {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
      <NotificationService />
      <div className="background-image-incu-1">
        <div className="incubator-container">
          <div className="incubator-list incu-container">
            
            <table className="incubator-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Occupied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incubators.map((incubator) => (
                  <tr key={incubator.incubatorId}>
                    <td>{incubator.incubatorId}</td>
                    <td>{incubator.location}</td>
                    <td>{incubator.occupied ? 'Yes' : 'No'}</td>
                    <td>
                      <button
                        className="delete-button-table-baby"
                        onClick={() => handleDeleteIncubator(incubator.incubatorId)}
                      >
                        Delete
                      </button>
                      <button
                        className="update-button-table-baby"
                        onClick={() => setSelectedIncubatorId(incubator.incubatorId)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedIncubatorId && (
            <div className="backdrop">
              <div className="update-incubator-page">
                <h2>Update Incubator</h2>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter New Location"
                  className="input-update-incu"
                />
                <button className="update-button-incu" onClick={handleUpdateIncubator}>Update</button>
              </div>
            </div>
          )}

            <div className="baby-names-container-incu">
           
            <ul>
              {babies.map((baby) => (
                <li key={baby.babyId}>
                  <button className="baby-redirect" onClick={() => redirectToIncubator(baby.babyId, baby.babyName, baby.incubator)}>
                    {baby.babyName}
                  </button>

                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="add-incubator">
            <h2>Add Incubator</h2>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Location"
              className='input-update-incu'
            />
            <button className="update-button-incu" onClick={handleAddIncubator}>Add</button>
          </div>
      {errorMessage && (
        <AlertModal message={errorMessage} onClose={closeModal} /> 
      )}
    </>
  );
};

export default IncubatorsPage;
