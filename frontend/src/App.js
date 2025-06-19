import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SignupPage from './pages/Register/Register.js';
import LoginPage from './pages/Login/Login.js';
import Dashboard from './pages/Home/HomePage.js';

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
          
            </Routes>
          </div>
        </div>
      </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
