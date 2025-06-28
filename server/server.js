import express from 'express'
import 'dotenv/config'
import cors from'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';

const app=express();

await connectDB();
//middlewares
app.use(cors({
  origin: true, // Reflects the request origin
  credentials: true
}));

app.use(express.json())

const PORT = process.env.PORT || 3000;

 

//Routes
app.get('/',(req,res)=>{
    res.send("API is Working")
})
app.use('/api/admin',adminRouter);


app.listen(PORT,()=>{
    console.log('Server is running on port' + PORT)
})

export default app;
