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
            
       const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found in token" });
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
        isPublished,
        user: userId,
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
     if (!blog.isPublished) {
      return res.status(403).json({ success: false, message: "Access denied" });
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
         const userId = req.user.id; 
  
        const blog = await Blog.findOne({ _id: id, user: req.user.id });

        if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
        }

    
        if (blog.user.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Access denied: not your blog" });
        }

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
        const userId = req.user.id;
        const blog = await Blog.findOne({ _id: id, user: userId });

        if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
        }
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
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const getAllBlogsAdmin = async(req,res)=>{
    try{
      const userId = req.user.id;
      const blogs = await Blog.find({user: userId }).sort({createdAt:-1});
      res.json({success:true,blogs})
    }
    catch(error){
      res.json({success:false,message:error.message})
    }
    }


    export const getDashboard = async (req,res)=>{
        try{
            const userId = req.user.id;
            const recentBlogs = await Blog.find({user: userId}).sort({createdAt:-1}).limit(5);
            const blogs = await Blog.countDocuments({user: userId});
            const userBlogIds = await Blog.find({ user: userId }).distinct('_id');
            const comments = await comment.countDocuments({ blog: { $in: userBlogIds } });
            const drafts = await Blog.countDocuments({ user: userId, isPublished: false })

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
        const userId = req.user.id;
        const commentToDelete = await comment.findById(id);
        const blog = await Blog.findById(commentToDelete.blog);
        if (blog.user.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Access denied: not your blog" });
        }
         await comment.findByIdAndDelete(id);
        res.json({success:true,message:"comment deleted"})

       }
       catch(error){res.json({success:false,message:error.message})

       }
    }
    export const getAllComments=async(req,res)=>{
        try {
             const userId = req.user.id;
             const userBlogIds = await Blog.find({ user: userId }).distinct('_id');
            const allcomments=await comment.find({ blog: { $in: userBlogIds }}).sort({ createdAt: -1 })
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