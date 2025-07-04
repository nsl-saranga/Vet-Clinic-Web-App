import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SignupPage from './pages/Register/Register.js';
import LoginPage from './pages/Login/Login.js';
import Dashboard from './pages/Home/HomePage.js';
import Services from './pages/Services/Services.js';
import ServiceDetails from './pages/ServiceDetails/ServiceDetails.js';
import MyPets from './pages/MyPets/MyPets.js';
import PetForm from './pages/PetForm/PetForm.js';
import MyAppointments from './pages/MyAppointments/MyAppointments.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <BrowserRouter>
        <div className="App">
          <div id='page-body'>
            <Routes>

              <Route path="/register" element={<SignupPage/>} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/home" element={<Dashboard/>} />
              <Route path="/services" element={<Services/>} />
              <Route path="/service/:serviceId" element={<ServiceDetails/>} />
              <Route path="/my-pets" element={<MyPets/>} />
              <Route path="/add-pet" element={<PetForm />} />
              <Route path="/edit-pet/:id" element={<PetForm />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
