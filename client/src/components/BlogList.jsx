 import React, { useEffect, useState } from 'react'
import { blog_data, blogCategories } from '../assets/assets'
import BlogCard from './BlogCard'
import { useAppContext } from '../context/Appcontext'
 
 const BlogList = () => {
  const {blog,input} = useAppContext();


  const filteredBlogs = () =>{
    if(input === ''){
      return blog
    }
     console.log(blog);
    return blog.filter((blog)=>
      blog.title.toLowerCase().includes(input.toLowerCase()) || blog.category.toLowerCase().includes
      (input.toLowerCase())
      
    )
    

  }


    const[category,setcategory]=useState("All");
   return (
     <div>
       <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
          {["All","Technology","Startup","Lifestyle","Finance"].map((item)=>(
           <div key={item} >
            
            <button onClick={()=> setcategory(item)}className='cursor-pointer text-gray-500'>
                {item }
                <div />
            </button>
            </div>
          ))}
       </div>
       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
        xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
          {filteredBlogs().filter((blog)=>
            category==="All"? true: blog.category===category)
          .map((blog) => (
        <BlogCard  
          _id={blog._id}
          title={blog.title}
          description={blog.description}
          image={blog.image}
          category={blog.category}
        />
      ))}
       </div>
 
     </div>
   )
 }
 
 export default BlogList
 