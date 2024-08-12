import React, { useState, useEffect } from 'react';
import './UpdateBaby.css';
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import NavbarParent from '../../ParentRoutes/NavbarParent/NavbarParent';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import NotificationService from '../../NotificationService/NotificationService';

function UpdateBaby() {
  const [babyName, setBabyName] = useState('');
  const [CNP, setCNP] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [incubator, setIncubator] = useState('');
  const [supervisorName, setSupervisor] = useState('');
  const [parentId, setParentId] = useState('');
  const [selectedBaby, setSelectedBaby] = useState(null);
  const [babyListData, setBabyListData] = useState([]); 
  const navigate = useNavigate();
  const currentSupervisorId = Cookies.get('supervisorId');
  const [role, setRole] = useState("");

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

useEffect(() => {
  fetchUserRole();
}, []);


  useEffect(() => {
    fetchBabyListData();
  }, []);

  const fetchBabyListData = async () => {
    
    try {
      const response = await fetch(`http://localhost:8081/api/baby/supervisor/${currentSupervisorId}`); 
      if (response.ok) {
        const data = await response.json();
        setBabyListData(data); 
      } else {
        console.error('Failed to fetch baby list data');
      }
    } catch (error) {
      console.error('Error fetching baby list data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBaby) return; 
  
   
    const updatedBaby = {
      babyId: selectedBaby.id,
      incubator: { incubatorId: incubator }, 
      name: babyName,
      gender,
      weight: parseInt(weight),
      height: parseInt(height),
      cnp: parseInt(CNP)
    };

    console.log(selectedBaby.id)
  
    try {
      const response = await fetch(`http://localhost:8081/api/baby/updateBaby/${selectedBaby.babyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBaby),
      });
      console.log(updatedBaby)
  
      if (response.ok) {
        console.log('Baby updated successfully:', updatedBaby);
        fetchBabyListData(); 
      } else {
        console.error('Failed to update baby:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating baby:', error.message);
    }
  

    setBabyName('');
    setCNP('');
    setWeight('');
    setHeight('');
    setGender('');
    setParentId('');
    setIncubator('');
    setSupervisor('');
  };
  
  

  const handleBabyClick = (baby) => {
    setSelectedBaby(baby);
    setBabyName(baby.babyName);
    setCNP(baby.cnp);
    setSupervisor(baby.supervisor);
    setIncubator(baby.incubator);
    setGender(baby.gender);
    setWeight(baby.weight);
    setHeight(baby.height);
    
  };

  const BabyListTable = () => {
    return (
      <div className="update-table-container">
        <table className="update-baby-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>CNP</th>
              <th>Gender</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Supervisor</th>
              <th>Incubator</th>
              
            </tr>
          </thead>
          <tbody>
            {babyListData.map((baby) => (
              <tr key={baby.id} onClick={() => handleBabyClick(baby)}>
                <td>{baby.babyName}</td>
                <td>{baby.cnp}</td>
                <td>{baby.gender}</td>
                <td>{baby.weight}</td>
                <td>{baby.height}</td>
                <td>{baby.supervisor}</td> 
                <td>{baby.incubator}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  

  return (
    <>
      {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
      <NotificationService />
      <div className="update-baby"></div>
      <div className="update-page-form">
        <h2 className="custom-text-component-update">Update Baby Record</h2>
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Baby's Name"
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            className="input-register"
            required
          />
          <input
            type="text"
            placeholder="CNP"
            value={CNP}
            onChange={(e) => setCNP(e.target.value)}
            className="input-register"
            required
          />
       
          <input
            type="text"
            placeholder="Incubator"
            value={incubator}
            onChange={(e) => setIncubator(parseInt(e.target.value))}
            className="input-register"
            required
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="gender-select"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-register"
            required
          />
          <input
            type="text"
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="input-register"
            required
          />
        
          <div className="button-container">
            <button type="submit" className="button-baby">
              Update
            </button>
          </div>
        </form>
      </div>
      <BabyListTable />
    </>
  );
}

export default UpdateBaby;
