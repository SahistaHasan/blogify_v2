import React, { useEffect, useState } from 'react'
import { blog_data } from '../../assets/assets';
import BlogTableItem from '../../components/admin/BlogTableItem';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/Appcontext';

const ListBlog = () => {
  const {blog,setBlog} = useAppContext();
  const {axios} = useAppContext()

  const fetchBlogs=async ()=>{
    try {
      const {data}=await axios.get('/api/admin/allblogs')
      if(data.success){
      setBlog(data.blogs)
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchBlogs();
  },[])
  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 '>
      <h1>All Blogs</h1>
      


       <div className='mt-4 relative h-4/5 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
            <table className='w-full text-sm text-gray-500'>
              <thead className='text-xs text-gray-600 text-left uppercase'>
                <tr>
                  <th scope='col' className='px-2 py-4'>#</th>
                  <th scope='col' className='px-2 py-4'>Blog Title</th>
                  <th scope='col' className='px-2 py-4'>Date</th>
                  <th scope='col' className='px-2 py-4'>Status</th> 
                  <th scope='col' className='px-2 py-4'>Actions</th>
                </tr>
              </thead>
              <tbody>
                 {blog.map((blog,index)=>(
                        <BlogTableItem  key={blog._id }  blog={blog}  
                           index={index+1} fetchBlogs={fetchBlogs}  />
                 ))}
              </tbody>
            </table>
        </div>


    </div>
  )
}

export default ListBlog