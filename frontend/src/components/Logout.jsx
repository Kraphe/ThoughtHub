import React from 'react';

import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
       <button onClick={handleLogout} type="button" className="mr-4 text-white bg-red-400 hover:bg-red-600 focus:outline-none focus:ring-4 focus:red-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">Logout</button>
 
  );
};

export default Logout;
