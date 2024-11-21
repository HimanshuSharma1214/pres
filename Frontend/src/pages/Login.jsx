import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const Login = () => {
   const navigate=useNavigate()
  const [state, setState] = useState('Sign up')
  const [email, SetEmail] = useState('')
  const [password, SetPassword] = useState('')
  const [name, SetName] = useState('')
  const{setToken,token,backendUrl}=useContext(AppContext)


  const onSubmitHandler = async (event) => {
    event.preventDefault()  //whenever we submit form it will not reload page
   
   
    try{
     
     if(state === 'Sign up'){
     
      
       const {data}=await axios.post(backendUrl + '/api/user/register',{name,password,email})
       
       if(data.success){
        localStorage.setItem('token',data.token)
        setToken(data.token)
       }
       else{
        toast.error(data.message)
        console.log(data.message);
        
       }
     }
     
     else{
      console.log("fds");
      const {data}=await axios.post(backendUrl+'/api/user/login',{password,email})
       if(data.success){
        localStorage.setItem('token',data.token)
        setToken(data.token)
       }
       else{
        toast.error(data.message)
        console.log(data.message);
        
       }
     }
    }
    catch(error){
      console.log(error);
        toast.error(error.message)
    }
  }
  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg '>

        <p className='text-2xl font-semibold'>{state === "Sign up" ? "Create Account" : "Login"}</p>
        <p>Please {state === "Sign up" ? "sign up" : "login"} to book an appoinment</p>
        {
          state === "Sign up" && <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' onChange={(e) => SetName(e.target.value)} required value={name} />
          </div>
        }

        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='email' onChange={(e) => SetEmail(e.target.value)} required value={email} />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='password' onChange={(e) => SetPassword(e.target.value)} required value={password} />
        </div>
        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>{state === "Sign up" ? "Create Account" : "Login"}</button>

        {
          state == "Sign up" ?
            <p>Already have an account? <span onClick={() => { setState('Login') }} className='text-primary underline cursor-pointer'> Login here</span>  </p>
            :
            <p>Create a new account? <span onClick={() => { setState('Sign up') }} className='text-primary underline cursor-pointer'> Click here</span></p>
        }


      </div>
    </form>
  )
}

export default Login
