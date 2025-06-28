import express from 'express'
import 'dotenv/config'
import cors from'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';

const app=express();

await connectDB();
//middlewares
const allowedOrigins = [
  'https://blogify-eight-sigma.vercel.app',
  'https://blogify-p20ytqwsx-blogifys-projects-fd54692c.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
