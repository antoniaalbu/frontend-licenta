import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Account Details/AccountDetails.css';
import AlertModal from '../../AlertModal/AlertModal';
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import NavbarParent from '../../ParentRoutes/NavbarParent/NavbarParent';
import NotificationService from '../../NotificationService/NotificationService';
import Cookies from 'js-cookie';
import './BabyPage.css';
import { Link } from 'react-router-dom';

function BabyAccount() {
  const { babyId, babyName } = useParams();
  const [babyDetails, setBabyDetails] = useState({
    name: '',
    parentFirstName: '',
    parentLastName: '',
    supervisor: '',
    cnp: '',
    weight: '',
    height: '',
    gender: '',
    incubator: '',
    parentId: ''
  });
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

  const [role, setRole] = useState("");
  const [isEditingBaby, setIsEditingBaby] = useState(false);
  const [isEditingParent, setIsEditingParent] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBabyDetails();
  }, []);

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

  useEffect(() => {
    fetchUserRole();
}, []);


  useEffect(() => {
    if (babyDetails.parentId) {
      fetchParentDetails(babyDetails.parentId);
      fetchBabyDetails();
    }
  }, [babyDetails.parentId]);

  const fetchBabyDetails = async () => {
    try {
      const babyResponse = await fetch(`http://localhost:8081/api/baby/${babyId}`);
      if (babyResponse.ok) {
        const babyData = await babyResponse.json();
        setBabyDetails(babyData);
        console.log(babyData)
      } else {
        console.error('Failed to fetch baby details');
      }
    } catch (error) {
      console.error('Error fetching baby details:', error);
    }
   
  };

  const fetchParentDetails = async (parentId) => {
    try {
      const parentResponse = await fetch(`http://localhost:8081/api/parents/details/${parentId}`);
      if (parentResponse.ok) {
        const parentData = await parentResponse.json();
        setParentDetails(parentData);
      } else {
        console.error('Failed to fetch parent details');
      }
    } catch (error) {
      console.error('Error fetching parent details:', error);
    }
  };

  const handleBabySubmit = async (e) => {
    e.preventDefault();
    const updatedBaby = {
      babyId: babyId,
      incubator: { incubatorId: babyDetails.incubator },
      name: babyDetails.name,
      gender: babyDetails.gender,
      weight: parseInt(babyDetails.weight),
      height: parseInt(babyDetails.height),
      cnp: parseInt(babyDetails.cnp)
    };
  

    try {
      const response = await fetch(`http://localhost:8081/api/baby/updateBaby/${babyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBaby),
        
      });

      if (response.ok) {
        console.log('Baby updated successfully:', updatedBaby);
        fetchBabyDetails(); 
        setIsEditingBaby(false); 
      } else {
        console.error('Failed to update baby:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating baby:', error.message);
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/api/update/${parentDetails.user.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(parentDetails.user),
        
      });
      console.log(parentDetails.user)
      if (response.ok) {
        console.log('Parent updated successfully:', parentDetails.user);
        fetchParentDetails(babyDetails.parentId); 
        setIsEditingParent(false); 
      } else {
        console.error('Failed to update parent:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating parent:', error.message);
    }
  };

  const handleBabyChange = (e) => {
    const { name, value } = e.target;
    setBabyDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentDetails(prevDetails => ({
      user: {
        ...prevDetails.user,
        [name]: value,
      }
    }));
  };

  const handleCloseAlert = () => {
    setAlertMessage('');
  };

  const updateBaby = () => {
    setIsEditingBaby(true);
  };

  const updateParent = () => {
    setIsEditingParent(true);
  };

  const goToSensors = () => {
    navigate(`/sensors/${babyDetails.incubatorId}/${babyId}/${babyName}`); 
  };

  return (
    <>
      {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
      <NotificationService />
      <div className="background-image-details-baby"></div>
      <div className="doctor-account-container">
        <h1 className='custom-text-baby'>{babyDetails.name}</h1>
        {isEditingBaby ? (
          <form onSubmit={handleBabySubmit} className="update-page-form-baby">
            <div className="input-container-column">
              <input
                type="text"
                placeholder="Baby's Name"
                value={babyDetails.name}
                onChange={handleBabyChange}
                name="name"
                className="input-update-baby"
                required
              />
              <input
                type="text"
                placeholder="CNP"
                value={babyDetails.cnp}
                onChange={handleBabyChange}
                name="cnp"
                className="input-update-baby"
                required
              />
              <select
                value={babyDetails.gender}
                onChange={handleBabyChange}
                name="gender"
                className="gender-select-baby"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                placeholder="Weight"
                value={babyDetails.weight}
                onChange={handleBabyChange}
                name="weight"
                className="input-update-baby"
                required
              />
              <input
                type="text"
                placeholder="Height"
                value={babyDetails.height}
                onChange={handleBabyChange}
                name="height"
                className="input-update-baby"
                required
              />
            </div>
            <div className="button-container">
              <button type="submit" className="update-details-button-baby">
                Update Baby Details
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="details-container-baby">
              <div className="details-view-baby">
                <p><strong>Name:</strong> {babyDetails.name}</p>
                
                {babyDetails.parents && babyDetails.parents.length > 0 && (
                  <div>
                    
                    {babyDetails.parents.map((parent, index) => (
                      <div key={index}>
                        <p><strong>Parent {index + 1}'s Full Name:</strong> {`${parent.parentFirstName} ${parent.parentLastName}`}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p><strong>Supervisor:</strong> {babyDetails.supervisorName}</p>
                <p><strong>CNP:</strong> {babyDetails.cnp}</p>
                <p><strong>Gender:</strong> {babyDetails.gender}</p>
                <p><strong>Weight:</strong> {babyDetails.weight} kg</p>
                <p><strong>Height:</strong> {babyDetails.height} cm</p>
              </div>
              <button className="update-details-button-baby" onClick={updateBaby}>Update Baby Details</button>
            </div>
          </div>
        )}
        {isEditingParent ? (
          <form onSubmit={handleUpdateDetails} className="update-page-form-parent">
            <div className="input-container-column">
              <input
                type="text"
                placeholder="Parent's First Name"
                value={parentDetails.user.firstName}
                onChange={handleParentChange}
                name="firstName"
                className="input-update-baby"
                required
              />
              <input
                type="text"
                placeholder="Parent's Last Name"
                value={parentDetails.user.lastName}
                  onChange={handleParentChange}
                  name="lastName"
                  className="input-update-baby"
                  required
                />
                <input
                  type="email"
                  placeholder="Parent's Email"
                  value={parentDetails.user.email}
                  onChange={handleParentChange}
                  name="email"
                  className="input-update-baby"
                  required
                />
                <input
                  type="tel"
                  placeholder="Parent's Telephone"
                  value={parentDetails.user.telephone}
                  onChange={handleParentChange}
                  name="telephone"
                  className="input-update-baby"
                  required
                />
              
              </div>
              <div className="button-container">
                <button type="submit" className="update-details-button-baby">
                  Update Parent Details
                </button>
              </div>
            </form>
          ) : (
            <div className="details-container-parent">
              <div className="details-view-parent">
               
                {babyDetails.parents && babyDetails.parents.length > 0 && (
                  <div>
                    {babyDetails.parents.map((parent, index) => (
                      <div key={index}>
                        <p><strong>Parent {index + 1}'s Full Name:</strong> {``}
                        <Link to={`/parent/${parent.parentId}`}>{`${parent.parentFirstName} ${parent.parentLastName}`}</Link></p>
                        <p><strong>Parent {index + 1}'s Email:</strong> {`${parent.parentEmail}`}</p>
                        <p><strong>Parent {index + 1}'s Telephone:</strong> {`${parent.parentTelephone}`}</p>
                      </div>
                    ))}
                  </div>
                )}
               
              </div>
              
            </div>
          )}
          <button className="details-container-dashboard" onClick={goToSensors}></button>
        </div>
        {alertMessage && <AlertModal message={alertMessage} onClose={handleCloseAlert} />}
      </>
    );
  }
  
  export default BabyAccount;
  