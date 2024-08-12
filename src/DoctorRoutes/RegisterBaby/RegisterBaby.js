import React, { useState, useEffect } from 'react';
import './RegisterBaby.css';
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import slideImage from '../../assets/stetoscop1.jpg'; 
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import NotificationService from '../../NotificationService/NotificationService';

function RegisterBaby() {
  const [showForm, setShowForm] = useState(false); 
  const [showBabyList, setShowBabyList] = useState(false);
  const [showViewBabyList, setShowViewBabyList] = useState(false);
  const [babyName, setBabyName] = useState('');
  const [CNP, setCnp] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [incubator, setIncubator] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [parentName, setParentName] = useState('');
  const [babyListData, setBabyListData] = useState([]); 
  const [slidePosition, setSlidePosition] = useState(0);
  const [supervisorList, setSupervisorList] = useState([]);
  const [supervisorId, setSupervisorId] = useState('');
  const [babies, setBabies] = useState([]); 
  const [selectedBabyId, setSelectedBabyId] = useState(''); 
  const [selectedSupervisorId, setSelectedSupervisorId] = useState(''); 
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  const currentSupervisorId = Cookies.get("supervisorId");
  const [alertMessage, setAlertMessage] = useState(''); 

    
  
  
    
  const fetchBabyListData = async () => {
    try {
      console.log("Fetching baby list data...");
      const response = await fetch('http://localhost:8081/api/baby/allBabies');
      if (response.ok) {
        console.log("Baby list data fetched successfully");
        const data = await response.json();
        console.log("Fetched baby list data:", data); 
        setBabyListData(data); 
        setError(null); 
     
      } else {
        console.error('Failed to fetch baby list data'); 
        setError('Failed to fetch baby list data'); 
      }
    } catch (error) {
      console.error('Error fetching baby list data:', error.message);
      setError('Error fetching baby list data: ' + error.message); 
    }
  };

  const fetchBabies = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/baby/supervisor/${currentSupervisorId}`);
      if (response.ok) {
        const data = await response.json();
        setBabies(data);
        console.log(babies);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSupervisorList = async () => {
    try {
      console.log("Fetching supervisor list...");
      const response = await fetch('http://localhost:8081/api/supervisors/supervisorList');
      if (response.ok) {
        console.log("Supervisor list fetched successfully");
        const data = await response.json();
        console.log("Fetched supervisor list:", data);
        setSupervisorList(data);
        setError(null);
      } else {
        console.error('Failed to fetch supervisor list');
        setError('Failed to fetch supervisor list');
      }
    } catch (error) {
      console.error('Error fetching supervisor list:', error.message);
      setError('Error fetching supervisor list: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const response = await fetch(`http://localhost:8081/api/supervisors/reassign/${selectedBabyId}/${selectedSupervisorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
  
      if (response.ok) {
      
        const data = await response.json();
       
        console.log('Baby reassigned successfully:', data);
    
        setBabyName('');
        setCnp('');
        setWeight('');
        setHeight('');
        setGender('');
        setParentName('');
        setIncubator('');
        setSupervisor('');
    
    
        setShowForm(false);
    
        fetchBabies();
      } else {
      
        const errorData = await response.json();
        console.error('Error reassigning baby:', errorData.error);
      }
    } catch (error) {
      console.error('Error reassigning baby:', error.message);
    }
    
  };

  const toggleBabyList = () => {
    setShowBabyList(prev => !prev);
    setSlidePosition(prevPosition => prevPosition); 
  };

  

  const handleBabyClick = (baby) => {
  
    setSelectedBabyId(baby.babyId); 
    setShowForm(true); 
  };

  const handleUpdateBaby = () => {

    navigate('/update-baby'); 
  };

  useEffect(() => {
    fetchBabyListData();
    fetchSupervisorList();
    fetchBabies();
  }, []);

  const handleDeleteBaby = async (babyId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/baby/deleteBaby/${babyId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        
        setBabyListData(prevData => prevData.filter(baby => baby.babyId !== babyId));
        console.log('Baby deleted successfully');
        fetchBabyListData();
        fetchBabies();
      } else {
        console.error('Failed to delete baby');
      }
    } catch (error) {
      console.error('Error deleting baby:', error);
    }
  };

  const BabyListTable = () => {
    return (
      
      <div className="backdrop-container">
        <button className="close-button-table" onClick={() => setShowBabyList(false)}>x</button>
        <div className={`baby-list-table-container ${showBabyList ? 'visible' : ''}`}>
        <table className="baby-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Weight</th>
              <th>Height</th>
              <th>CNP</th>
              <th>Gender</th>
              <th>Parent</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {babies.map((baby) => (
              <tr key={baby.babyId} onClick={() => handleBabyClick(baby)}>
                <td>{baby.babyName}</td>
                <td>{baby.weight} kg</td>
                <td>{baby.height} cm</td>
                <td>{baby.cnp}</td>
                <td>{baby.gender}</td>
             
                <td>{baby.parentNames ? baby.parentNames.join(', ') : ''}</td>
                <td>
                  <button className='delete-table-button' onClick={(e) => {e.stopPropagation(); handleDeleteBaby(baby.babyId); }}>x</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    );
   
  };

  const redirectToBabyProfile = (babyId, babyName) => {
    console.log(babyId)
    navigate(`/babyProfile/${babyId}/${babyName}`);
  };

  return (
    <>
      <NavbarDoctor />
      <NotificationService />
      <div className="register-container">
        <div className="background-image-register-baby"></div>
        {showForm && <div className="backdrop-container"></div>}
        <div className="baby-names-container-register">
            <h2>Assigned Babies</h2>
            <ul>
              {babies.map((baby) => (
                <li key={baby.babyId}>
                  <button className="baby-redirect" onClick={() => redirectToBabyProfile(baby.babyId, baby.babyName)}>
                    {baby.babyName}
                  </button>

                </li>
              ))}
            </ul>
          </div>
          <div className="view-baby-list-table-container">
          <table className="view-baby-list-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Weight</th>
                <th>Height</th>
                <th>CNP</th>
                <th>Gender</th>
                <th>Parent</th>
              </tr>
            </thead>
            <tbody>
              {babies.map((baby) => (
                <tr key={baby.id} onClick={() => redirectToBabyProfile(baby.babyId, baby.babyName)}>
                  <td>{baby.babyName}</td>
                  <td>{baby.weight} kg</td>
                  <td>{baby.height} cm</td>
                  <td>{baby.cnp}</td>
                  <td>{baby.gender}</td>
                  <td>
                    {baby.parentNames.map((parentName, index) => (
                      <span key={index}>{parentName}{index !== baby.parentNames.length - 1 ? ', ' : ''}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
        <div className={`register-form-baby ${showForm ? 'visible' : ''}`}>
          <h2 className="custom-text-component-baby-1">Reassign Baby</h2>
          <button className="close-button-baby" onClick={() => setShowForm(false)}>×</button>
          <form onSubmit={handleSubmit} className="form">
            
            
            <select
              value={selectedBabyId}
              onChange={(e) => setSelectedBabyId(e.target.value)}
              className="gender-select"
              required
            >
              <option value="">Select Baby</option>
              {babies.map(baby => (
                <option key={baby.babyId} value={baby.babyId}>
                  {baby.babyName}
                </option>
              ))}
            </select>

            <select
              value={selectedSupervisorId}
              onChange={(e) => setSelectedSupervisorId(e.target.value)}
              className="gender-select"
              required
            >
              <option value="">Select Supervisor</option>
              {supervisorList.map(supervisor => (
                <option key={supervisor.supervisorId} value={supervisor.supervisorId}>
                  {supervisor.firstName} {supervisor.lastName}
                </option>
              ))}
            </select>

            <button type="submit" className="button-baby">Reassign Baby</button>
          </form>
        </div>


       
          <div>
            {!showForm && (
              <button className="show-form-button" onClick={() => setShowForm(true)}>
                Reassignment Form
              </button>
            )}
            <button className="delete-button" onClick={toggleBabyList}>
              Delete Record
            </button>
            <button className="update-button" onClick={handleUpdateBaby}>
              Update Record
            </button>
          </div>
      
     

        {showBabyList && <BabyListTable />}
        {showViewBabyList }
      </div>
    </>
  );
}

export default RegisterBaby;
