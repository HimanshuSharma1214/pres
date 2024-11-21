import express from 'express'

import { addDoctor,adminDashboard,allDoctors,AppoinmentCancel,appoinmentsAdmin,loginAdmin } from '../controllers/adminController.js'

import upload from '../middleware/multer.js'
import authAdmin from '../middleware/authAdmin.js'
import { changeAvailabilty } from '../controllers/doctorController.js'


const adminRouter=express.Router()

adminRouter.post('/add-doctor',authAdmin, upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailabilty)
adminRouter.get('/appointments',authAdmin,appoinmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,AppoinmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)

export default adminRouter