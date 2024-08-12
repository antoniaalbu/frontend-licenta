import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./routes/Login/Login";
import Register from './routes/Register/Register';
import Home from './routes/Home/Home';
import HomeDoctor from './DoctorRoutes/HomeDoctor/HomeDoctor';
import SensorData from './components/SensorData';
import P5Sketch from './routes/EcgVisualiser/EcgVisualiser';
import Doctors from './routes/DoctorDescription/Doctor';
import Incubator from './routes/IncubatorPage/Incubator';
import Baby from './routes/BabyPage/Baby';
import BabyRegistrationForm from './DoctorRoutes/RegisterBaby/RegisterBaby';
import UpdateBaby from './DoctorRoutes/UpdateBaby/UpdateBaby';
import UpdateParent from './DoctorRoutes/UpdateParent/UpdateParent';
import ParentOp from './DoctorRoutes/ParentOp/ParentOp';
import Dashboard from './DoctorRoutes/Sensors/Sensors';
import TemperatureGraphic from './DoctorRoutes/Charts/TemperatureGraphic'
import HumidityGraphic from './DoctorRoutes/Charts/HumidityGraphic';
import MicrophoneGraphic from './DoctorRoutes/Charts/MicrophoneGraphic';
import PampersHumidityGraphic from './DoctorRoutes/Charts/PampersHumidityGraphic';
import EcgChart from './routes/EcgVisualiser/EcgVisualiser';
import DoctorAccount from './DoctorRoutes/Account Details/AccountDetails';
import HomeParent from './ParentRoutes/HomeParent/HomeParent';
import ParentAccount from './ParentRoutes/AccountDetails/ParentDetails';
import DashboardParent from './ParentRoutes/Sensors/SensorParent';
import BabyAccount from './DoctorRoutes/BabyPage/BabyPage';
import IncubatorOp from './DoctorRoutes/IncubatorOp/IncubatorOp';
import IncubatorsPage from './DoctorRoutes/IncubatorPage/IncubatorPage';
import Sensors from './DoctorRoutes/AboutSensors/AboutSensors';
import Sketch from './routes/PS5/PS5';
import ArduinoComm from './routes/BluetoothTest/ArduinoComm';
import SaveNotificationPage from './Notifcations/Notifications';
import Notifications from './Notifcations/Notifications';
import BodyTemperatureGraphic from './DoctorRoutes/Charts/BodyTempGraph';
import DoctorDetails from './ParentRoutes/DocDetails/DocDetails';
import ParentDetails from './DoctorRoutes/ParentAccount/ParentAccount';
import NotificationsParent from './ParentRoutes/InboxParent/InboxParent';

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/homeDoctor" element={<HomeDoctor />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/SensorData" element={<SensorData />} />
          <Route path="/ecgVisualiser" element={<EcgChart />} />
          <Route path="/doctorPage" element={<Doctors />} />
          <Route path="/incubator" element={<Incubator />} />
          <Route path="/baby" element={<Baby />} />
          <Route path="/registerBaby" element={<BabyRegistrationForm />} />
          <Route path="/update-baby" element={<UpdateBaby />} />
          <Route path="/manageParents" element={<ParentOp />} />
          <Route path="/update-parent" element={<UpdateParent />} />
          <Route path="/sensors/:incubatorId/:babyId/:babyName" element={<Dashboard />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/4/:incubatorId" element={<TemperatureGraphic />} />
          <Route path="/5/:incubatorId" element={<HumidityGraphic />} />
          <Route path="/3/:incubatorId" element={<MicrophoneGraphic />} />
          <Route path="/2/:incubatorId" element={<PampersHumidityGraphic />} />
          <Route path="/6/:incubatorId" element={<BodyTemperatureGraphic />} />
          <Route path="/sensors/:sensorType" element={<BodyTemperatureGraphic />} />
          <Route path="/sensors/2" element={<PampersHumidityGraphic />} />
          <Route path="/sensors/3" element={<MicrophoneGraphic />} />
          <Route path="/sensors/4" element={<TemperatureGraphic />} />
          <Route path="/sensors/5" element={<HumidityGraphic />} />
          <Route path="/sensors/6" element={<BodyTemperatureGraphic />} />
          <Route path="/doctorAccount" element={<DoctorAccount />} />
          <Route path="/homeParent" element={<HomeParent />} />
          <Route path="/parentAccount" element={<ParentAccount />} />
          <Route path="/supervisor/:supervisorId" element={<DoctorDetails />} />
          <Route path="/dashboardParent" element={<DashboardParent />} />
          <Route path="/babyProfile/:babyId/:babyName" element={<BabyAccount />} />
          <Route path="/incubatorOp/:incubatorId/:babyId/:babyName" element={<IncubatorOp />} />
          <Route path="/incubatorPage" element={<IncubatorsPage />} />
          <Route path="/1/:babyId" element={<Sketch />} />
          <Route path="/comm" element={<ArduinoComm />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/parent/:parentId" element={<ParentDetails />} />
          <Route path="/notificationsParent" element={<NotificationsParent />} />
         
        </Routes>
        </Router>
    </div>
);
}
