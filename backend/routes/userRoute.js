import express from 'express'
import { registerUser,loginUser, getProfile, updateProfile, bookAppoinment, listAppoinment, cancelAppoinment, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'


const userRouter=express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppoinment)
userRouter.get('/appointments',authUser,listAppoinment)
userRouter.post('/cancel-appointment',authUser,cancelAppoinment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)


export default userRouter