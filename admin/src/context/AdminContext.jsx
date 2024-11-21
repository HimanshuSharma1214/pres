import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export const AdminContext=createContext()

const AdminContextProvider=(props)=>{
     const[doctors,setDoctors]=useState([])
    const[aToken,setaToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const[dashdata,setdashdata]=useState(false)
    const[appointments,setAppointments]=useState([])
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
     
     


    const getAlldoctors=async(req,res)=>{
      try{
        const {data}=await axios.post(backendUrl+'/api/admin/all-doctors',{},{headers:{aToken}})
        if(data.success){
           setDoctors(data.doctors)          
        }else{
          toast.error(data.message)
        }
      }
      catch(error){
        toast.error(error.message)
      }
    }

    const changeAvailability=async(docId)=>{
      try{
        const {data}=await axios.post(backendUrl+'/api/admin/change-availability',{docId},{headers:{aToken}})
         if(data.success){
          toast.success(data.message)
          getAlldoctors()
         }else{
          toast.error(data.message)
         }
      }
      catch{
        toast.error(error.message)
      }
    }

    const getAllAppoinments=async()=>{
      
      try {  
        const {data}=await axios.get(backendUrl+'/api/admin/appointments',{headers:{aToken}})
        if(data.success){
          console.log(data.appointments);
          setAppointments(data.appointments)
         }
         else{
          toast.error(data.message)
         }
      } catch (error) {
        toast.error(error.message)
      }
    }


    const CancelAppointment=async(appointmentId)=>{
       try {
        const {data}=await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
        if(data.success){
          toast.success(data.message)
          getAllAppoinments()
         }
         else{
          toast.error(data.message)
         }
      } catch (error) {
        toast.error(error.message)
       }
    }

    const getdashdata=async(req,res)=>{
      try {
        const {data}=await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}})
        if(data.success){
          console.log(typeof(data.dashdata.latestAppointments))
          setdashdata(data.dashdata)
         }
         else{
          toast.error(data.message)
          console.log(data.message);
         }
      } catch(error) {
        toast.error(error.message)
        console.log(error.message);
      }
    }

    const value={
     aToken,setaToken,
     backendUrl,doctors,getAlldoctors,changeAvailability
     ,getAllAppoinments,dashdata,setdashdata,getdashdata,appointments,setAppointments,CancelAppointment
    }

  return (
    <AdminContext.Provider value={value}>
        {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider