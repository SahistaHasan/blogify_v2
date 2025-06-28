import React from 'react'
import { useAppContext } from '../../context/Appcontext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
   const {axios,setToken}=useAppContext();
   const [email,setEmail]=useState('');
    const[password,setPassword]=useState("");
    const navigate = useNavigate();
   
  const handleSubmit= async(e) =>{
e.preventDefault();
try{
  const {data}=await axios.post('api/admin/login',{email,password})
  if(data.success){
    setToken(data.token);
    localStorage.setItem('token',data.token)
    axios.defaults.headers.common['Authorization']=data.token;
    navigate('/admin')
  }
  else{
    toast.error("Wrong username and password")
  }
    
  }
  catch(error){
    toast.error(error.message);
  }
}
  
    return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-purple-700 shadow-xl shadow-purple-500 rounded-lg'>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full py-6 text-center'>
           <h1 className='text-3xl font-bold'><span className='text-purple-600'>Admin 
            </span> Login</h1>
            <p className='font-light'>Enter your credentials to access the admin panel</p>



</div>
<form onSubmit={handleSubmit}>
  <div className='flex flex-col'>
    <label>Email</label>
    <input type='email' onChange={(e)=>setEmail(e.target.value)}required placeholder='your email id' className='border-b-2 border-gray-300 p-2 outline-none mb-6'/>

  </div>

  <div className='flex flex-col'>
    <label>Password</label>
    <input type='password' onChange={(e)=>setPassword(e.target.value)} required placeholder='your password' className='border-b-2 border-gray-300 p-2 outline-none mb-6'/>
    
  </div>
  <button type='submit' className='w-full py-3 font-medium bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-300'>
    Login
  </button>
</form>
        </div>
      </div>
      
    </div>
  )
}

export default Login