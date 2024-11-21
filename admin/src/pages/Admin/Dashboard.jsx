import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const{aToken,dashdata,getdashdata,CancelAppointment}=useContext(AdminContext)

  const {slotDateFormat}=useContext(AppContext)

  
  useEffect(()=>{
    if(aToken){
      getdashdata()
    }  
  },[aToken])
  return dashdata && (
    <div className='m-5'>
       <div className='flex flex-wrap gap-3'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt=''/>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt=''/>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt=''/>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>

       </div>


       <div className='bg-white'>

        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon}/>
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
        {
            dashdata.latestAppointments.map((item,index)=>(
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                 <img className='rounded-full w-10' src={item.docData.image}/>
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                  <p className='text-gray-800 '>{slotDateFormat(item.slotDate)}</p>
                </div>
              {item.cancelled
               ?
               <p className='text-red-400 text-xs font-medium'>Cancelled</p>
               :
               <img onClick={()=>CancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon}/>
              }
              </div>
            ))
           }
        </div>
       </div>

    </div>
  )
}

export default Dashboard
