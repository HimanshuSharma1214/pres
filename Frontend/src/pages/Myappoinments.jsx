import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from "../context/AppContext"
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
const MyAppoinments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appoinments, setAppointments] = useState([]);
  const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const navigate=useNavigate()

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }
 
  const getUserappoinment = async (req, res) => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        setAppointments(data.appoinments.reverse())
        console.log(data.appoinments);
      } else {

      }

    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  }

  const cancelAppointment = async (appoinmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appoinmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserappoinment()
        getDoctorsData()
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  }

  const initPay=(order)=>{
      const options={
        key:import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:order.amount,
        currency:order.currency,
        name:'Appoinment Payment',
        description:'Appoinment Payment',
        order_id:order.id,
        receipt:order.receipt,
        handler:async(response)=>{
            try {
              const {data}=await axios.post(backendUrl + '/api/user/verifyRazorpay',response, { headers: { token } })
              if (data.success) {
                getUserappoinment()
               navigate('/my-appoinments')
              } 
            } catch (error) {
              toast.error(error.message)
              console.log(error);
            }
        }
      }
      const rzp=new window.Razorpay(options)
      rzp.open()
  }

  const appoinmentRazorpay = async (appoinmentId) => {
       try{
        const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appoinmentId }, { headers: { token } })
        if (data.success) {
          initPay(data.order)
        }
        else {
          toast.error(data.message)
        }
      }
       catch{
        toast.error(error.message)
        console.log(error);
       }
  }


  useEffect(() => {
    if (token) {
      getUserappoinment()
    }
  }, [token])


  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appoinments</p>
      <div>
        {appoinments.slice(0, 3).map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt='' />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.specialtiy}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{slotDateFormat(item.slotDate)}|{item.slotTime}</p>
            </div>

            <div className='flex flex-col gap-2 justify-end'>
               {!item.cancelled && item.payment && <button onClick={()=>appoinmentRazorpay(item._id)} className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
              {!item.cancelled && !item.payment&& <button onClick={()=>appoinmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transtion all  duration-300 '>Pay Online</button>}
              {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transtion all  duration-300 '>Cancel Appoinment</button>}
              {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appoinment Cancelled</button>}
            </div>
            <div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppoinments
