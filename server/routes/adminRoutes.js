import e from "express";
import { adminLogin } from "../controllers/adminController.js";
import { addBlog, addComment, approveCommentById, deleteBlogById, deleteCommentById, generateContent, getAllBlogs, getAllBlogsAdmin, getAllComments, getBlogById, getBlogComment, getDashboard, publishToggle } from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import blockDemoUser from "../middleware/blockDemoUser.js";

const adminRouter = e.Router();

adminRouter.post("/login",adminLogin);


adminRouter.post('/add',upload.single('image'),auth,blockDemoUser,addBlog);
adminRouter.get('/blogs',getAllBlogs)
adminRouter.post('/delete',auth,blockDemoUser,deleteBlogById)
adminRouter.post('/publish-toggle',auth,blockDemoUser,publishToggle)
adminRouter.post('/addComment',addComment);
adminRouter.post('/comments',getBlogComment);
adminRouter.get('/allblogs',auth, getAllBlogsAdmin)
adminRouter.post('/delete-comment',auth,blockDemoUser,deleteCommentById)
adminRouter.post('/approve-comment',auth,blockDemoUser,approveCommentById)
adminRouter.get('/dashboard',auth, getDashboard)
adminRouter.get('/allComments',getAllComments);
adminRouter.get('/:blogId',getBlogById)
adminRouter.post('/generate',auth, generateContent)


export default adminRouter;