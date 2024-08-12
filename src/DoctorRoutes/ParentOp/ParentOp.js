import React, { useState, useEffect } from 'react';
import './ParentOp.css';
import NavbarDoctor from '../NavbarDoctor/NavbarDoctor';
import slideImage from '../../assets/docParent.jpg';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import AlertModal from '../../AlertModal/AlertModal';
import RedirectModal from '../../RedirectModal/RedirectModal';
import NavbarParent from '../../ParentRoutes/NavbarParent/NavbarParent';
import NotificationService from '../../NotificationService/NotificationService';

const ParentOp = () => {
  const [showParentList, setShowParentList] = useState(false);
  const [showViewParentList, setShowViewParentList] = useState(false);
  const [showViewAssignedParentList, setShowAssignedViewParentList] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [CNP, setCnp] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [incubator, setIncubator] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [babyName, setBabyName] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);
  const [slidePosition, setSlidePosition] = useState(0);
  const [parentList, setParentList] = useState([]);
  const [assignedParentList, setAssignedParentList] = useState([]);
  const currentSupervisorId = Cookies.get("supervisorId");
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredParentList, setFilteredParentList] = useState([]);
  const [showAlert, setShowAlert] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(''); 
  const [showSearchBar, setShowSearchBar] = useState(false); 
  const [filteredAssignedParentList, setFilteredAssignedParentList] = useState([]);
  const [availableIncubators, setAvailableIncubators] = useState([]);
  const [step, setStep] = useState(1);
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState('');
  const [redirectMessage, setRedirectMessage] = useState('');
  const [role, setRole] = useState("");


  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};

useEffect(() => {
  fetchUserRole();
}, []);



const toggleSearchBar = () => {
  setShowSearchBar(prev => !prev);
};

const handleSearchAssignedParent = () => {
  const filteredAssignedParents = assignedParentList.filter((parent) =>
    `${parent.firstName} ${parent.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setFilteredAssignedParentList(filteredAssignedParents);
};



  const handleSearch = () => {
    const filteredParents = parentList.filter((parent) =>
      `${parent.firstName} ${parent.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredParentList(filteredParents);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, parentList]);

  useEffect(() => {
    handleSearchAssignedParent();
  }, [searchQuery, assignedParentList]);
  

  useEffect(() => {
    console.log("Filtered parent list:", filteredParentList);
  }, [filteredParentList]); 

  const searchInput = (
    <input
      type="text"
      placeholder="Search by parent's full name"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className='search-bar'
    />
  );
  
  const navigate = useNavigate();

  const fetchAvailableIncubators = async () => {
    try {
        const response = await fetch('http://localhost:8081/api/incubators/available');
        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('HTTP error:', response.status, errorDetails);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        console.log('Available incubator IDs:', data.availableIncubatorIds);
        setAvailableIncubators(data.availableIncubatorIds);
        

        if (data.availableIncubatorIds.length === 0) {
            setRedirectMessage('No available incubators.');
        }
    } catch (error) {
        console.error('Error fetching available incubators:', error);
        setRedirectMessage('Error fetching available incubators. Please try again later.');
    }
};



  


  const fetchParentList = async () => {
    try {
      console.log('Fetching parent list...');
      const response = await fetch('http://localhost:8081/api/parents/parentList');

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
    fetchAvailableIncubators();
    fetchBabies();
  }, []);

  const handleDeleteParent = async (parentId) => {
    console.log("Parent ID:", parentId);
    try {
      const response = await fetch(`http://localhost:8081/api/parents/delete/${parentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('HTTP error:', response.status, errorDetails);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchParentList();
      fetchAssignedParentList();
      setSelectedParent(null);
    } catch (error) {
      console.error('Error deleting parent:', error);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!selectedParent) return;
  
    try {

      const checkResponse = await fetch(`http://localhost:8081/api/incubators/checkOccupied/${incubator}`);
      console.log(incubator)
      if (!checkResponse.ok) {
        const errorDetails = await checkResponse.text();
        console.error('HTTP error:', checkResponse.status, errorDetails);
        throw new Error(`HTTP error! status: ${checkResponse.status}`);
      }
  
      const responseDataInc = await checkResponse.json();
      console.log('Incubator occupation status:', responseDataInc);
  
      if (responseDataInc.occupied) {
     
        setAlertMessage("The selected incubator is already occupied. Please select a different one.");
        setShowAlert(true);
        return;
      }
  
   
      const requestBody = {
        babyId: null,
        supervisor: { supervisorId: currentSupervisorId },
        incubator: { incubatorId: incubator },
        babyName: babyName,
        parentId: selectedParent.parentId,
        gender,
        weight: parseInt(weight),
        height: parseInt(height),
        cnp: parseInt(CNP)
      };
  
      console.log('Request body:', requestBody);
  
      const response = await fetch('http://localhost:8081/api/parents/registerBaby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      console.log('Response status:', response.status);
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Response from backend:', responseData);
  
        console.log('Baby registered successfully.');
  
 
        setStep(1);
        setBabyName('');
        setCnp('');
        setWeight('');
        setHeight('');
        setGender('');
        setIncubator('');
        setSupervisor('');
        setShowForm(false);
  
        fetchParentList();
      } else {
        const errorData = await response.json();
        console.error('Error registering baby:', errorData.message);
      }
    } catch (error) {
      console.error('Error registering baby:', error);
    }
  };

  const handleAssignBaby = async (event) => {
   

    try {
        const response = await fetch(`http://localhost:8081/api/parents/assignBaby/${selectedParent.parentId}/${selectedBabyId}/${currentSupervisorId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
           
        });

        if (response.ok) {
            console.log('Baby assigned successfully');
           
            setShowForm(false);
        } else {
            const errorData = await response.json();
            console.error('Error assigning baby:', errorData.message);
        }
        fetchParentList();
    } catch (error) {
        console.error('Error assigning baby:', error);
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
  

  const fetchAssignedParentList = async () => {
    try {
      console.log('Fetching assigned parent list...');
      const response = await fetch(`http://localhost:8081/api/parents/supervisor/${currentSupervisorId}`);

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('HTTP error:', response.status, errorDetails);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received assigned parent list:', data);

      setAssignedParentList(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  

  useEffect(() => {
    fetchParentList();
    fetchAssignedParentList();
  }, []);

  const toggleParentList = () => {
    setShowParentList(prev => !prev);
    setSlidePosition(prevPosition => prevPosition);
  };

  const toggleViewParentList = () => {
    toggleSearchBar();
    setShowViewParentList(prev => !prev);
    setSlidePosition(prevPosition => (prevPosition === 0 ? -900 : 0));
  };

  const toggleViewAssignedParentList = () => {
    toggleSearchBar();
    setShowAssignedViewParentList(prev => !prev);
    setSlidePosition(prevPosition => (prevPosition === 0 ? -900 : 0));
  };

  const handleParentClick = (parent) => {
    console.log("Clicked parent:", parent);
    setSelectedParent(parent);
    setShowForm(false); 
    setShowUpdateForm(true); 
  };

  const handleUpdateParent = () => {
    navigate('/update-parent');
  };

  const handleNextStep = (e) => {
 
    handleAssignBaby();
  
    setStep(2);
};

const handlePreviousStep = () => {
    setStep(1);
};

const handleBabySelection = (event) => {
  setSelectedBabyId(event.target.value);
};


  const ParentListTable = () => (
    <div className="backdrop-container">
      <button className="close-button-table" onClick={() => setShowParentList(false)}>x</button>
      <div className={`parent-list-table-container ${showParentList ? 'visible' : ''}`}>
        <table className="parent-list-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Telephone</th>
              <th>Country</th>
              <th>City</th>
              <th>Street Number</th>
              <th>Baby Names</th> 
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {parentList.map((parent) => (
              <tr key={parent.userId}>
                <td>{parent.firstName}</td>
                <td>{parent.lastName}</td>
                <td>{parent.email}</td>
                <td>{parent.username}</td>
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
                  <button 
                    className="delete-table-button" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleDeleteParent(parent.userId); 
                    }}
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AssignedParentList = ({ assignedParentList, setShowForm, setSelectedParent }) => {
    const handleParentClick1 = (parent) => {
        setStep(1)
        setSelectedParent(parent);
        setShowForm(true);
      }
    
    return (
      <div className={`view-parent-list-table-container ${showViewAssignedParentList ? 'visible' : ''}`}>
        <table className="view-parent-list-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Telephone</th>
              <th>Country</th>
              <th>City</th>
              <th>Street Number</th>
              <th>Baby Name</th>
            </tr>
          </thead>
          <tbody>
            {assignedParentList.map((parent) => (
              <tr key={parent.id} onClick={() => handleParentClick1(parent)}>
                <td>{parent.firstName}</td>
                <td>{parent.lastName}</td>
                <td>{parent.email}</td>
                <td>{parent.username}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  

  const ParentListTable1 = ({ filteredParentList, setShowForm, setSelectedParent }) => {
   
      const handleParentClick = (parent) => {
        setStep(1)
        console.log(parent.supervisorId)
        console.log(currentSupervisorId)
        const supervisor = parseInt(currentSupervisorId)
        if(parent.supervisorId === supervisor || parent.supervisorId === null)
          {
            console.log(parent.supervisorId)
            console.log(supervisor)
            setSelectedParent(parent);
            setShowForm(true);
          }
        if(parent.supervisorId !== supervisor && parent.supervisorId !==null) {
          
          setAlertMessage("This parent is assigned to a different supervisor.");
          setShowAlert(true);
        } 
        
      
      
    };
  
    return (
      <div className={`view-parent-list-table-container ${showViewParentList ? 'visible' : ''}`}>
        <table className="view-parent-list-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Telephone</th>
              <th>Country</th>
              <th>City</th>
              <th>Street Number</th>
              <th>Baby Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredParentList.map((parent) => (
              <tr key={parent.id} onClick={() => handleParentClick(parent)}>
                <td>{parent.firstName}</td>
                <td>{parent.lastName}</td>
                <td>{parent.email}</td>
                <td>{parent.username}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleRedirect = () => {
    navigate('/incubatorPage');
  };
  
  

  return (
    <>
      {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
      <NotificationService />
      <div className="register-container">
        <div className="background-image-parent-1"></div>
        {showAlert && <AlertModal message={alertMessage} onClose={closeAlert} />}
        {showForm &&<div className="backdrop-container"></div>}
        
        <div className={`register-form-parent ${showForm ? 'visible' : ''}`}>
          <h2 className="custom-text-component">Register Baby</h2>
          <button className="close-button" onClick={() => setShowForm(false)}>×</button>
          {selectedParent && (
        <>
          Add baby for parent: {selectedParent.firstName} {selectedParent.lastName}
        </>
      )}
      {step === 1 && (
        <form onSubmit={handleAssignBaby} className="form">
          <p></p>
          <select
            id="baby-select"
            value={selectedBabyId}
            onChange={handleBabySelection}
            className='gender-select-parent'
          >
            <option value="">Select a Baby</option>
            {babies.map((baby) => (
              <option key={baby.babyId} value={baby.babyId}>
                {baby.babyName}
              </option>
            ))}
          </select>
          <button className='button-parent' type="submit">Assign Baby</button>
          <button className='button-parent' type="submit" onClick={handleNextStep}>Add a New Baby</button>
        </form>
      )}


      {step === 2 && (
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Baby's Name"
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            className="input-register-parent"
            
          />
          <input
            type="text"
            placeholder="CNP"
            value={CNP}
            onChange={(e) => setCnp(e.target.value)}
            className="input-register-parent"
            
          />
          <input
            type="text"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-register-parent"
           
          />
          <input
            type="text"
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="input-register-parent"
            
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="gender-select-parent"
           
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            value={incubator}
            onChange={(e) => setIncubator(e.target.value)}
            className="gender-select-parent"
           
          >
            <option value="">Select Incubator</option>
            {availableIncubators.map((incId) => (
              <option key={incId} value={incId}>
                Incubator {incId}
              </option>
              
            ))}
             
          </select>
         
          <div className="button-container">
            <button type="submit" className="button-parent">
              Register
            </button>
            <button type="submit" className="button-parent" onClick={handlePreviousStep}>
              Back
            </button>
          </div>
          {redirectMessage && <RedirectModal message={redirectMessage} onClose={handleRedirect} />}
        </form>
      )}
        </div>
         
        
        <div
          className="slide-image-parent"
          style={{
            transform: `translateX(${slidePosition}px)`,
            height: '30%',
            width: '50%',
            position: 'absolute',
            top: '42%',
            left: '10.8%',
            overflow: 'hidden'
          }}
        >
          <img src={slideImage} alt="Slide Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

     
        <button className="delete-parent-button" onClick={toggleParentList}>
          Delete Record
        </button>
        <button className="update-parent-button" onClick={handleUpdateParent}>
          Update Record
        </button>
        
        {!showForm && !showUpdateForm && (
          <button className="show-parent-list-button" onClick={toggleViewParentList}>
            {showViewParentList ? ' ' : 'Show Parent List' && showViewAssignedParentList ? '' : 'Show Parent List'}
          </button>
          
        )}
        {showViewParentList && (
        <button className="close-parent-list-button" onClick={toggleViewParentList}>
          Close Table
        </button>
          )}

        {!showForm && !showUpdateForm && (
          <button className="show-assigned-parent-list-button" onClick={toggleViewAssignedParentList}>
            {showViewAssignedParentList ? ' ' : 'Show Assigned Parent List' && showViewParentList ? '' : 'Show Assigned Parent List'}
          </button>
        )}
        {showViewAssignedParentList && (
        <button className="close-assigned-parent-list-button" onClick={toggleViewAssignedParentList}>
          Close Table
        </button>
        )}


        {showSearchBar && searchInput} 
       
        {showParentList && <ParentListTable />}
        {showAlert && <AlertModal message={alertMessage} onClose={closeAlert} />}
        {showViewParentList && <ParentListTable1 filteredParentList={filteredParentList} setShowForm={setShowForm} setSelectedParent={setSelectedParent} />}
        {showViewAssignedParentList && <AssignedParentList assignedParentList={filteredAssignedParentList} setShowForm={setShowForm} setSelectedParent={setSelectedParent}/>}

      </div>
    </>
  );
}

export default ParentOp;