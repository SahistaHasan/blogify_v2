import React, { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill';
import { useAppContext } from '../../context/Appcontext';
import toast from 'react-hot-toast';
import {parse} from 'marked'



const AddBlog = () => {

  const {axios}= useAppContext();
 


  const editorRef = useRef(null);     // The container for the editor
  const quillRef = useRef(null);      // Stores the Quill instance
  


   useEffect(() => {
    if (!quillRef.current && editorRef.current) {   //“If the <div> is ready and quill is not initialised 
                                                   // befor then create a Quill editor inside it.”
      quillRef.current = new Quill(editorRef.current, { theme:'snow'})
      quillRef.current.on('text-change',()=>{
        const html = quillRef.current.root.innerHTML;
        setDescription(html);
      })
        
    }
  }, []);


  const [description,setDescription]=useState("")
  const[image,setImage]=useState(null);
  const[title,setTitle]=useState('')
    const[subTitle,setSubTitle] = useState('')
    const[category,setCategory]=useState('Startup')
    const [isPublished,setIsPublished]=useState(false)
    const [loading,setLoading]=useState(false);
  
  const onSubmitHandler = async (e) =>{
    try {
      e.preventDefault();
      

      const blog={
        title,subTitle,description,
        category,isPublished
      }

      const formData = new FormData();
      formData.append('blog',JSON.stringify(blog))
      formData.append('image',image)
      console.log("Selected image file:", image)

      const {data} = await axios.post('/api/admin/add',formData)
      if(data.success){
        toast.success(data.message)
        setImage(null);
        setTitle('')
        quillRef.current.root.innerHTML=''
        setCategory('Startup');

      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    }
  
 
  const generateContent=async()=>{

    if(!description || description.length<10){
      return toast.error("Please enter a description of atleast 10 characters")
    }
      try{
        setLoading(true);
         const {data} = await axios.post('/api/admin/generate', {prompt:description})
          if (data.success) {
      quillRef.current.root.innerHTML = parse(data.content);
      setDescription(data.content);
      toast.success("Blog content generated!");

    } else {
      toast.error("Failed to generate content.");
    }
      }
      catch(error){
           toast.error(error.message);
      }
      finally{
        setLoading(false);
      }

  }
  return (
   <form onSubmit ={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
    <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
      <p>Upload thumbnail</p>   
      <label htmlFor="image">
        <img src={!image? assets.upload_area : URL.createObjectURL(image)}         //Using htmlFor="image" means:
                                                                                   //This label is connected to the element
                                                                                   //  with id="image".So when the label is clicked, the associated <input> element 
                                                                                   // is automatically focused or triggered.


        alt="" className='mt-2 h-16 rounded cursor-pointer'/>                       
        <input onChange={(e)=> setImage(e.target.files[0])} hidden type="file"
        id='image' name='image' />
      </label>

      <p className='mt-4'>Blog Title</p>
      <input type='text' placeholder='Type here' required className='w-full
      max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' 
      onChange={e=>setTitle(e.target.value)} value={title}/>


      <p className='mt-4'>Sub Title</p>
      <input type='text' placeholder='Type here' required className='w-full
      max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
       onChange={e=>setSubTitle(e.target.value)} value={subTitle}/>

       <p className='mt-4'>Blog Description</p>
       <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
         <div ref={editorRef} ></div>
         {loading && (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
    <div className="loader"></div>
  </div>
  )}
        <button disabled={loading} className='absolute bottom-1 right-2 ml-2 text-xs text-white
         bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer
         'type='button' onClick={generateContent} >Generate with AI</button>
       </div>


        <p className='mt-4'> Blog Category </p>
        <select onChange={e=> setCategory(e.target.value)} name='category'className='mt-2 px-3 py-2 border text-gray-500
        border-gray-300 outline-none rounded'>
          <option value=''>Select Category</option>
          {blogCategories.map((item,index)=>{
            return <option key={index} value={item}> {item} </option>
          })}
        </select>

        <div className='flex gap-2 mt-4'> 
          <p>Publish Now</p>
          <input type='checkbox' checked={isPublished} className='scale-125 cursor-pointer'
           onChange={e=> setIsPublished(e.target.checked)}/>
        </div>
        <button onSubmit={onSubmitHandler} type='submit' className='mt-8 w-40 h-10 bg-purple-600
        text-white rounded cursor-pointer text-sm'>Add Blog</button>
    </div>
   </form>
  )
}

export default AddBlog