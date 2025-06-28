import React from 'react'
import { assets } from '../../assets/assets'
import {  NavLink } from 'react-router-dom'

const Sidebar = () => {
     const baseClasses = "flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer";
  const activeClasses = "flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer bg-purple-100 border-r-4 border-purple-400";
  return (
    /*end prop is used in dashboard so that it exactly matches path ./admin otherwise it will be active all the time since navlink donot matches exact route */
    <div className='flex flex-col border-r border-gray-200 min-h-full pt-6  pl-1'>  
        <NavLink to='/admin' end={true} className={({isActive})=>isActive? activeClasses:baseClasses}> 
        <img src={assets.home_icon} alt="" className='min-w-4 w-5'/>   
        <p className='hidden md:inline-block'>Dashboard</p>
        </NavLink>

         <NavLink to='/admin/addBlog' className={({isActive})=>isActive? activeClasses:baseClasses}>
        <img src={assets.add_icon} alt="" className='min-w-4 w-5'/>
        <p className='hidden md:inline-block'>Add Blogs</p>
        </NavLink>
       

         <NavLink to='/admin/listBlog' className={({isActive})=>isActive? activeClasses:baseClasses}>
        <img src={assets.list_icon} alt="" className='min-w-4 w-5'/>
        <p className='hidden md:inline-block'>Blog List</p>
        </NavLink>

        <NavLink to='/admin/comments' className={({isActive})=>isActive? activeClasses:baseClasses}>
        <img src={assets.comment_icon} alt="" className='min-w-4 w-5'/>
        <p className='hidden md:inline-block'>Comments</p>
        </NavLink>
    </div>
  )
}

export default Sidebar