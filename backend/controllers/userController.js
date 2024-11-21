//api to register user
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import { v2 as cloudniary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appoinmentModel.js'
import razorpay from 'razorpay'
import Razorpay from 'razorpay'

const registerUser = async (req, res) => {
   try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
         return res.json({ success: false, message: "Missing Details" })
      }

      if (!validator.isEmail(email)) {
         return res.json({ success: false, message: "Enter a Valid Email" })
      }

      if (password.length < 8) {
         return res.json({ success: false, message: "Enter a Strong Password" })
      }
      ///encrypt/hashing the password
      const salt = await bcrypt.genSalt(10) //generates a salt, a random string that will be added to the password before hashing.

      const hashedPassword = await bcrypt.hash(password, salt) //hashedPassword, is a secure, hashed version of the original password, which you can store safely in a database.

      const userData = {
         name,
         email,
         password: hashedPassword
      }

      const newUser = new userModel(userData)
      const user = await newUser.save()

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
   }
   catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }
}
//api for user login

const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body
      const user = await userModel.findOne({ email })

      if (!user) {
         return res.json({ success: false, message: "user does not exist" })
      }

      const isMatch = await bcrypt.compare(password, user.password)
 

      if (isMatch) {
         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
         res.json({ success: true, token })
      } else {
         res.json({ success: false, message: "invalid credentials" })
      }
   }
   catch {
      console.log(error);
      res.json({ success: false, message: error.message })
   }
}
//api for user profile data
const getProfile = async (req, res) => {
   try {
      const { userId } = req.body; // id has been added to token while genrating token of userlogin
      const userData = await userModel.findById(userId).select('-password')
      res.json({ success: true, userData })
   }
   catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }
}
//api for update user profle
const updateProfile = async (req, res) => {
   try {

      const { userId, name, phone, address, dob, gender } = req.body
      const imageFile = req.file
      if (!name || !phone || !dob || !gender) {
         return res.json({ success: false, message: "Data missing" })
      }
      await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
      if (imageFile) {
         //upload image to clooudniary
         const imageUpload = await cloudniary.uploader.upload(imageFile.path, { resource_type: 'image' })
         const imageURL = imageUpload.secure_url
         await userModel.findByIdAndUpdate(userId, { image: imageURL })
      }
      res.json({ success: true, message: "Profile updated" })
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }
}

//api to book appoinment

const bookAppoinment = async (req, res) => {
   try {
      const { userId, docId, slotDate, slotTime } = req.body;

      const docData = await doctorModel.findById(docId).select('-password')
      if (!docData.available) {
         return res.json({ success: false, message: "Doctor not Available" })
      }

      let slots_booked = docData.slots_booked

      //checking for availability

      if (slots_booked[slotDate]) { //if slotdate is booked we will check time is availble or not
         if (slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: "Slot not available" })
         }
         else {
            slots_booked[slotDate].push(slotTime)
         }
      }
      else { //else adding date
         slots_booked[slotDate] = []
         slots_booked[slotDate].push(slotTime)
      }

      const userData = await userModel.findById(userId).select('-password')
      delete docData.slots_booked

      const appoinmentData = {
         userId, docId, userData, docData, amount: docData.fees, slotTime, slotDate, date: Date.now()

      }
      const newAppoinment = new appointmentModel(appoinmentData)
      await newAppoinment.save()

      //save new slots that are booked in docdata

      await doctorModel.findByIdAndUpdate(docId, { slots_booked })
      res.json({ success: true, message: "Appoinment Booked" })
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }
}

//api to get apoinments booked by user

const listAppoinment = async (req, res) => {
   try {
      const { userId } = req.body
      const appoinments = await appointmentModel.find({ userId })
      res.json({ success: true, appoinments })
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }
}

//api to cancel the appoinment

const cancelAppoinment = async (req, res) => {
   try {
      const { userId, appoinmentId } = req.body
      const appoinmentData = await appointmentModel.findById(appoinmentId)

      //verify appoinment user

      if (appoinmentData.userId !== userId) {
         return res.json({ success: false, message: "Unauthorized action" })
      }

      await appointmentModel.findByIdAndUpdate(appoinmentId, { cancelled: true })

      //removing cancelled slot from slotsbooked

      const { docId, slotDate, slotTime } = appoinmentData;

      const doctorData = await doctorModel.findById(docId)

      let slots_booked = doctorData.slots_booked

      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

      await doctorModel.findByIdAndUpdate(docId, { slots_booked })
      res.json({ success: true, message: "Appointment Cancelled" })

   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }
}

const razorpayInstance = new razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET,
})
//api for online payment using razorpay

const paymentRazorpay = async (req, res) => {

   try {
      const { appoinmentId } = req.body
      const appoinmentData = await appointmentModel.findById(appoinmentId)

      if (!appoinmentData || appoinmentData.cancelled) {
         res.json({ success: false, message: "Appoinment cancelled or not found" })
      }

      //creating options for razorpary payments

      const options = {
         amount: appoinmentData.amount * 100,
         currency: process.env.CURRENCY,
         receipt: appoinmentId
      }

      //creation of an order

      const order = await razorpayInstance.orders.create(options)

      res.json({ success:true,order})

   }
   catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }

}


//api to verify payment of razorpay

const verifyRazorpay=async(req,res)=>{
   try {
      const {razorpay_order_id}=req.body
      const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
      
      if(orderInfo.status ==='paid'){
               await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
               res.json({ success:true, message:"Payment Succesfull" })
      }
      else{
         res.json({ success: false, message: "Payment failed"})
      }
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })
   }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppoinment,paymentRazorpay, listAppoinment, verifyRazorpay,cancelAppoinment }