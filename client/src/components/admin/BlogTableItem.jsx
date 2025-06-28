import React from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/Appcontext'
import toast from 'react-hot-toast'

const BlogTableItem = ({blog,index}) => {
 
  const {axios,fetchBlogs}=useAppContext()
  console.log(fetchBlogs)
  const deleteBlog = async()=>{
    try {
      const {data}=await axios.post('/api/admin/delete' ,{id:blog._id} ) 
      if(data.success){
        toast.success(data.message)
        
        fetchBlogs();
        
      }  else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error)
    }
  }

  const togglePublish=async()=>{
    try {
      const {data}=await axios.post('/api/admin/publish-toggle',{id:blog._id})  
      if (data.success) {
        toast.success(data.message)
        
        
        fetchBlogs();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
       toast.error(error.message)
    }
  }
    
  return (
    <tr className='border-y border-gray-300'>
        <th className='px-2 py-4'>{index}</th>
        <td className='px-2 py-4'>{blog.title}</td>
        <td className='px-2 py-4 max-sm:hidden'>{new Date(blog.createdAt).toDateString()}</td>
        <td className='px-2 py-4 max-sm:hidden'>
            <p className={blog.isPublished? "text-green-600" :"text-orange-700" }>
                {blog.isPublished? 'Published':'Unpublished'}
            </p>
        </td>
        <td className='px-2 py-4 flex text-xs gap-3'>
            <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>{blog.isPublished?
             'Unpublish':'Publish'}</button>
             <img onClick={deleteBlog} src={assets.cross_icon} className='w-8 hover:scale-110 transition-all cursor-pointer' alt=""/>
        </td>
    </tr>
  )
}

export default BlogTableItem