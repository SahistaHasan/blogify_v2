import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js'
import comment from '../models/Comment.js'
import main from '../configs/gemini.js';;



export const addBlog = async (req,res)=>{
    try{

         console.log("req.body.blog:", req.body.blog);     
         console.log("req.file:", req.file);  


       const {title,subTitle,description,category,isPublished} =JSON.parse
       (req.body.blog);
       const imageFile=req.file;

       if(!title || !description || !category || !imageFile){
        return res.json({success:false, message:"Missing required fields"})
       }

       const fileBuffer = fs.readFileSync(imageFile.path)
       const response = await imagekit.upload({
         file:fileBuffer,
         fileName: imageFile.originalname,
         

       })
       

       const optimizedImageUrl = imagekit.url({
        path:response.filePath,
        transformation:[
            {quality:'auto'},
            {format:'webp'},
            {width:'1280'}
        ]
       })
       const image=optimizedImageUrl;


       await Blog.create({
        title,
        subTitle,
        description,
        category,
        image,
        isPublished
    })
    
       res.json({success:true,message:"Blog added successfully"})
    }
    
    catch(error){
        res.json({success:false, message:error.message})

    }
}

export const getAllBlogs = async(req,res)=>{
    try{
      const blogs = await Blog.find({isPublished:true})
      res.json({success:true,blogs})
    }
    catch(error){
     res.json({success:false,message:error.message})
    }
} 

export const getBlogById =  async(req,res)=>{

    try{ 
        
        const blogId = req.params.blogId;
          const blog = await Blog.findById(blogId)
    if(!blog){
        return res.json({success:false, message:"Blog not found"})

    }
    res.json({success:true,blog})

    }
    catch(error){
        res.json({success: false, message:error.message})

    }
}

export const deleteBlogById =  async(req,res)=>{
    try{ 
         const {id} = req.body;

         await Blog.findByIdAndDelete(id);  
         await comment.deleteMany({blog:id})
         res.json({success:true,message:"blog deleted successfully"})

    }
    catch(error){
        res.json({success: false, message:error.message})

    }
}

export const publishToggle=async(req,res)=>{
    try{
        const {id} = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();

        res.json({success:true, message:"Succesfully updated"})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const addComment = async(req,res)=>{
    try{
        const {blog,name,content} = req.body
        await  comment.create({blog,name,content});
        res.json({success:true, message:'Comment added for review'})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const getBlogComment = async(req,res)=>{
    try{
        const{blogId} = req.body;
        const comments = await comment.find({blog:blogId,isApproved:true}).sort(
            {createdAt:-1})
            res.json({success:true,comments})
    }
    catch{
        res.json({success:false,message:error.message})
    }
}

export const getAllBlogsAdmin = async(req,res)=>{
    try{
      const blogs = await Blog.find({}).sort({createdAt:-1});
      res.json({success:true,blogs})
    }
    catch(error){
      res.json({success:false,message:error.message})
    }
    }


    export const getDashboard = async (req,res)=>{
        try{
            const recentBlogs = await Blog.find({}).sort({createdAt:-1}).limit(5);
            const blogs = await Blog.countDocuments();
            const comments = await comment.countDocuments();
            const drafts = await Blog.countDocuments({isPublished:false})

            const dashboardData={
                blogs,comments,drafts,recentBlogs
            }
            res.json({success:true,dashboardData})
        }
        catch(error){
            res.json({success:false,message:error.message})
        }
    }

    export const approveCommentById = async (req,res) =>{
       try{
        const {id} = req.body;
        await comment.findByIdAndUpdate(id, {isApproved:true})
        res.json({success:true,message:"comment approved"})

       }
       catch(error){res.json({success:false,message:error.message})

       }
    }

     export const deleteCommentById = async (req,res) =>{
       try{
        const {id} = req.body;
        await comment.findByIdAndDelete(id);
        res.json({success:true,message:"comment deleted"})

       }
       catch(error){res.json({success:false,message:error.message})

       }
    }
    export const getAllComments=async(req,res)=>{
        try {
            const allcomments=await comment.find({}).sort({ createdAt: -1 })
      res.json({success:true,allcomments})
        } catch (error) {
            res.json({success:false,message:error.message})
        }
    }
    export const generateContent = async (req,res)=>{
       try {
          const {prompt}=req.body;
          const content = await main(prompt +' generate a blog contenet for the above content in simple text format')
          res.json({success:true,content})
       } catch (error) {
        res.json({success:false,message:error.message})
       }
    }