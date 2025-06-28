import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'


const BlogCard = ({_id,title, description, image, category }) => {
    const navigate=useNavigate();
  return (
  <div onClick={()=>navigate(`/blog/${_id}`)} className='w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-purple-600 duration-300 cursor-pointer'>
    <img src={image} alt="" />
    <span className='ml-5 mt-4 px-3 py-1 inline-block bg-purple-600 rounded full 
    text-white text-xs'> {category} </span>
    <div className='p-5'>
        <h5 className='mb-2 font-medium text-gray-900'>{title}</h5>
        <p className='mb-3 text-xs text-gray-600' dangerouslySetInnerHTML={{__html:description.slice(0,80)}}></p>
    </div>
  </div>
    
  )
}

export default BlogCard
