import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/Appcontext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token } = useAppContext();

  return (
    <div className='flex justify-between items-center py-0 mx-8 sm:mx-20 xl:mx-32'>

      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-40 md:w-40 lg:w-40 cursor-pointer object-contain"
      />

      {/* Login/Dashboard Button */}
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 rounded-full text-sm bg-gray-800 text-white px-6 sm:px-10 py-2.5 hover:bg-gray-700 transition-colors"
      >
        {token ? 'Dashboard' : 'Login'}
        <img src={assets.arrow} alt="arrow" className="w-3" />
      </button>
    </div>
  );
};

export default Navbar;
