// frontend/src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || ''}/api/users/login`, loginData);
      const userData = response.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setLoginData({ username: '', password: '' });
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || ''}/api/users/register`, registerData);
      alert('Registration successful! Please log in.');
      setShowRegisterModal(false);
      setShowLoginModal(true);
      setRegisterData({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
      });
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Flight Booking</Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/flights" className="hover:text-blue-200">Flights</Link>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link to="/PersonalArea" className="hover:underline">Personal Area</Link>
              <span>Welcome, {user?.username}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  setShowLoginModal(true);
                  setShowRegisterModal(false);
                }}
                className="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  setShowRegisterModal(true);
                  setShowLoginModal(false);
                }}
                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Login</h2>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Register</h2>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="block mb-1">Username*</label>
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Email*</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Password*</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">First Name</label>
                <input
                  type="text"
                  value={registerData.first_name}
                  onChange={(e) => setRegisterData({...registerData, first_name: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Last Name</label>
                <input
                  type="text"
                  value={registerData.last_name}
                  onChange={(e) => setRegisterData({...registerData, last_name: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
