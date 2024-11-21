import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appoinmentModel.js"
import userModel from "../models/userModel.js"



//api for adding doctors 

const addDoctor=async(req,res)=>{

    try{
       const{name,email,password,speciality,degree,experience,about,fees,address}=req.body
       const imageFile=req.file

       //checking for all data to add doctor

        if(!name||!email||!password||!speciality||!degree||!experience||!about||!fees||!address){
            return res.json({success:false,message:"Missing Details"})
        }

        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }

        //validating strong password
        if(password.length<8){
            return res.json({success:false,message:"Please enter a strong password"})
        }

        //encrypting paassword ans saving in db

        //hashing doctor password

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        console.log(hashedPassword);
        console.log(hashedPassword.length);
        
        // upload image to cloduinary

        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl=imageUpload.secure_url
        
        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }
        const newDoctor=new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true,message:"Doctor Added"})
    }
    catch(error){
       console.log(error);
       res.json({success:false,message:error.message})
    }
}

//API FOR ADMIN LOGGING

const loginAdmin=async(req,res)=>{
    try{
       const{email,Password}=req.body
       
       
       if(email===process.env.ADMIN_EMAIL&&Password===process.env.ADMIN_PASSWORD)
       {
              const token=jwt.sign(email+Password,process.env.JWT_SECRET)
              res.json({success:true,token})
       }else{
          res.json({success:false,message:"Invalid Credentials"})
       }
    }
    catch(error){
       console.log(error);
       res.json({success:false,message:error.message})
    }
}

//API To get all doctors list for admin panel

const allDoctors=async(req,res)=>{
    try{
      const doctors=await doctorModel.find({}).select('-password')
      res.json({success:true,doctors})
    }
    catch{
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API to get all apoinments list

const appoinmentsAdmin=async(req,res)=>{
    try {
        const appointments=await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//Api to cancel appoinment

const AppoinmentCancel = async (req, res) => {
    try {
       const {appointmentId } = req.body
       const appoinmentData = await appointmentModel.findById(appointmentId)
 
       
       await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
 
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


//api for dashboard data for admin

const adminDashboard=async(req,res)=>{
    try {
        const doctors = await doctorModel.find({})
        const users=await userModel.find({})
        const appointments=await appointmentModel.find({})

        const dashdata={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashdata})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
export {addDoctor,loginAdmin,allDoctors,adminDashboard,appoinmentsAdmin,AppoinmentCancel}
