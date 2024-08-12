import React, { useState, useEffect } from 'react';
import '../UpdateBaby/UpdateBaby.css';
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import NavbarParent from '../../ParentRoutes/NavbarParent/NavbarParent';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import NotificationService from '../../NotificationService/NotificationService';

function UpdateParent() {
  const [parentEmail, setParentEmail] = useState('');
  const [parentUsername, setParentUsername] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentRole, setParentRole] = useState('');
  const [parentTelephone, setParentTelephone] = useState('');
  const [parentFirstName, setParentFirstName] = useState('');
  const [parentLastName, setParentLastName] = useState('');
  const [parentCountry, setParentCountry] = useState('');
  const [parentCity, setParentCity] = useState('');
  const [parentStreet, setParentStreet] = useState('');
  const [parentNumber, setParentNumber] = useState('');
  const [babyNameJS, setBabyName] = useState('');
  const [babyId, setBabyId] = useState('');
  const [parentList, setParentList] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [babyList, setBabyList] = useState([]);
  const currentSupervisorId = Cookies.get('supervisorId');
  const [role, setRole] = useState("");

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

useEffect(() => {
  fetchUserRole();
}, []);

  
  

  const navigate = useNavigate();


  const fetchParentList = async () => {
    try {
      console.log('Fetching parent list...');
      const response = await fetch(`http://localhost:8081/api/parents/supervisor/${currentSupervisorId}`);

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('HTTP error:', response.status, errorDetails);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received parent list:', data);

      const filteredParentList = data.filter(user => user.role === 'parent');

    
      setParentList(filteredParentList);
    } catch (error) {
      console.error('Error fetching parent list:', error);
    }
  };

  useEffect(() => {
    fetchParentList();
  }, [currentSupervisorId]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParent) return; 

    try {

      const updateRequest = {
        userId: selectedParent.userId,
        parentId: selectedParent.parentId,
        username: parentUsername,
        password: parentPassword,
        role: parentRole,
        firstName: parentFirstName,
        lastName: parentLastName,
        email: parentEmail,
        telephone: parentTelephone,
        country: parentCountry,
        city: parentCity,
        street: parentStreet,
        number: parentNumber,
        babies: babyList.map(baby => ({
          id: baby.id,
          name: baby.id === babyId ? babyNameJS : baby.name 
        }))
      };

      console.log('Update Request Payload:', updateRequest); 

      const response = await fetch(`http://localhost:8081/api/parents/updateParent/${selectedParent.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateRequest)
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('HTTP error:', response.status, errorDetails);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setParentUsername('');
      setParentRole('');
      setParentPassword('');
      setParentEmail('');
      setParentTelephone('');
      setParentFirstName('');
      setParentLastName('');
      setParentCountry('');
      setParentCity('');
      setParentStreet('');
      setParentNumber('');
      setBabyName('');
      setBabyId('');

     
      fetchParentList();
    } catch (error) {
      console.error('Error updating parent:', error);
    }
  };

  const handleParentClick = (parent) => {
    console.log("Selected parent: ", parent);
    setSelectedParent(parent); 

   
    const babyList = parent.babyNames.map((name, index) => ({
      name: name,
      id: parent.babyIds[index]
    }));

    setBabyList(babyList);

 
    setParentUsername(parent.username);
    setParentPassword(parent.password);
    setParentRole(parent.role);
    setParentEmail(parent.email);
    setParentTelephone(parent.telephone);
    setParentFirstName(parent.firstName);
    setParentLastName(parent.lastName);
    setParentCountry(parent.country);
    setParentCity(parent.city);
    setParentStreet(parent.street);
    setParentNumber(parent.number);
    setBabyName(babyList.length > 0 ? babyList[0].name : ''); 
    setBabyId(babyList.length > 0 ? babyList[0].id : ''); 
  };

  const handleBabyChange = (e) => {
    const selectedBabyName = e.target.value; 

 
    const selectedBaby = babyList.find(baby => baby.name === selectedBabyName);

    setBabyName(selectedBaby ? selectedBaby.name : '');
    setBabyId(selectedBaby ? selectedBaby.id : ''); 
  };

  const ParentListTable = () => {
    return (
      <div className="update-parent-table-container">
        <table className="update-parent-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Country</th>
              <th>City</th>
              <th>Street Number</th>
              <th>Baby Names</th>
              <th>Baby IDs</th>
            </tr>
          </thead>
          <tbody>
            {parentList.map((parent) => (
              <tr key={parent.userId} onClick={() => handleParentClick(parent)}>
                <td>{parent.firstName}</td>
                <td>{parent.lastName}</td>
                <td>{parent.username}</td>
                <td>{parent.role}</td>
                <td>{parent.email}</td>
                <td>{parent.telephone}</td>
                <td>{parent.country}</td>
                <td>{parent.city}</td>
                <td>{parent.street}</td>
                <td>
                  {parent.babyNames.map((babyName, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <br />} 
                      {babyName}
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {parent.babyIds.map((babyId, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <br />} 
                      {babyId}
                    </React.Fragment>
                  ))}
                </td>
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
      <div className="update-parent"></div>
      <div className="update-page-form">
        <h2 className="custom-text-component-update">Update Parent Record</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Parent's First Name"
            value={parentFirstName}
            onChange={(e) => setParentFirstName(e.target.value)}
            className="input-update"
            required
          />
          <input
            type="text"
            placeholder="Parent's Last Name"
            value={parentLastName}
            onChange={(e) => setParentLastName(e.target.value)}
            className="input-update"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            className="input-update"
            required
          />
          <input
            type="text"
            placeholder="Telephone"
            value={parentTelephone}
            onChange={(e) => setParentTelephone(e.target.value)}
            className="input-update"
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={parentCountry}
            onChange={(e) => setParentCountry(e.target.value)}
            className="input-update"
            required
          />
          <input
            type="text"
            placeholder="City"
            value
            ={parentCity}
            onChange={(e) => setParentCity(e.target.value)}
            className="input-update"
            required
          />
          <input
            type="text"
            placeholder="Street"
            value={parentStreet}
            onChange={(e) => setParentStreet(e.target.value)}
            className="input-update"
            required
          />
          <input
            type="text"
            placeholder="Number"
            value={parentNumber}
            onChange={(e) => setParentNumber(e.target.value)}
            className="input-update"
            required
          />

          <select
            value={babyNameJS} 
            onChange={handleBabyChange} 
            className="name-select"
            required
          >
            <option value="" disabled>Select Baby</option>
            {babyList.map((baby) => (
              <option key={baby.id} value={baby.name}> 
                {baby.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Baby's Name"
            value={babyNameJS} 
            onChange={(e) => setBabyName(e.target.value)} 
            className="input-update"
            required
          />

          <button type="submit" className="button-update-parent">Update</button>
        </form>
      </div>
      <ParentListTable />
    </>
  );
}

export default UpdateParent;
