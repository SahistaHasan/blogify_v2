import React, { useState } from 'react';
import { useAppContext } from '../../context/Appcontext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const { axios, setToken } = useAppContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [isSignup, setIsSignup] = useState(false); // toggle between login/signup

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        // SIGNUP API
        const { data } = await axios.post('api/admin/signup', { name, email, password });
        if (data.success) {
          toast.success(data.message);
          setToken(data.token);
          localStorage.setItem('token', data.token);
          axios.defaults.headers.common['Authorization'] = data.token;
          navigate('/admin');
        } else {
          toast.error(data.message);
        }
      } else {
        // LOGIN API
        const { data } = await axios.post('api/admin/login', { email, password });
        if (data.success) {
          toast.success('Login successful!');
          setToken(data.token);
          localStorage.setItem('token', data.token);
          axios.defaults.headers.common['Authorization'] = data.token;
          navigate('/admin');
        } else {
          toast.error('Wrong username or password');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 border border-purple-700 shadow-xl shadow-purple-500 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-center mb-2">
            {isSignup ? 'Signup' : 'Login'}
          </h1>
          <p className="font-light text-center mb-6">
            {isSignup
              ? 'Create an account to access the admin panel'
              : 'Enter your credentials to access the admin panel'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignup && (
              <div className="flex flex-col">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="border-b-2 border-gray-300 p-2 outline-none"
                />
              </div>
            )}

            <div className="flex flex-col">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email"
                className="border-b-2 border-gray-300 p-2 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
                className="border-b-2 border-gray-300 p-2 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-medium bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-300"
            >
              {isSignup ? 'Signup' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="text-purple-600 cursor-pointer hover:underline"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Login' : 'Signup'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
