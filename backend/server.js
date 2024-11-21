import express from 'express'
import cors from 'cors'
import  'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
const app=express()
const port=process.env.PORT||4000

connectDB()
connectCloudinary()

//Middlewares

app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/admin',adminRouter)
//at localhost:4000/api/admin , adminrouter will be used
//then localhost:4000/api/admin/add-doctor addDoctor fn will be executed
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)



app.get('/',(req,res)=>{
  res.send('API WORKINGdf')
})

app.listen(port,()=>console.log("Server Started",port))