import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export const Register = () => {


  const { register } = useAuth()

  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleDataChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [name]: e.target.value
    })
  }


  const handleRegister = async () => { console.log('submitted'); await register(data) }




  return (
    <div className="pointer-events-none relative flex h-screen flex-col items-center justify-center gap-8 overflow-hidden [&>*]:pointer-events-auto">
      <div className="absolute left-0 z-30 h-screen max-w-2xl w-full p-8 px-28 flex justify-center items-start gap-5 flex-col bg-dark shadow-md bg-black">

        <div className='flex flex-col item-start space-x-1 space-y-1'>
          <h1 className="text-4xl flex-col font-bold text-violet-600">
          Get started
          </h1>
          <p className='text-xs font-medium text-white/80'>Create a new account</p>
        </div>

        {/* input for entering the username */}
        <div className='flex flex-col w-full space-y-2'>

          <div className="w-full space-y-1">
            <label className='text-sm'>Username</label>
            <input
              type='text'
              placeholder='your_name'
              value={data.username}
              className='"block w-full h-10 rounded-md outline outline-[1px] text-white/80  focus:ring-1  drop-shadow-xl placeholder:text-sm placeholder:text-white/30  outline-zinc-400/30  px-5 bg-zinc-800/30 text-white  placeholder:text-white/70",'
              onChange={handleDataChange("username")}
            />
          </div>
          <div className="w-full space-y-1">
            <label className='text-sm'>Email</label>
            <input
              type='email'
              placeholder='you@exmample.com'
              value={data.email}
              className='"block w-full h-10 rounded-md outline outline-[1px] text-white/80  focus:ring-1  drop-shadow-xl placeholder:text-sm placeholder:text-white/30  outline-zinc-400/30  px-5 bg-zinc-800/30 text-white  placeholder:text-white/70",'
              onChange={handleDataChange("email")}
            />
          </div>
          <div className="w-full">
            <label className='text-sm'>Password</label>
            <input
              type='password'
              placeholder='************'
              value={data.password}
              className='"block w-full h-10 rounded-md outline outline-[1px] text-white/80  focus:ring-1  drop-shadow-xl placeholder:text-sm placeholder:text-white/30  outline-zinc-400/30  px-5 bg-zinc-800/30 text-white  placeholder:text-white/70",'
              onChange={handleDataChange("password")}
            />
          </div>
          {/* Button to initiate the login process */}
        </div>
        <button
          className='rounded-md w-full px-8 py-2 bg-violet-800 font-semibold'
          onClick={handleRegister}
        >
          Register
        </button>


        {/* Link to the registration page */}
        <div className='w-full flex flex-col space-y-1 justify-center items-center'>
          <small className="text-zinc-300">
            Already have an account{" "}
            <a className="text-primary hover:underline" href="/login">
              Login
            </a>
          </small>

          {/* divider */}
          <div id="or" className='text-sm'> OR </div>
        </div>

        <div className='w-full'>
          <button className='w-full py-3 px-6 rounded-md item-center bg-black text-white font-medium border border-white'>
            Google 
          </button>
        </div>

      </div>
      <div className="stars absolute -left-full -z-50 mt-[56px] h-screen w-[200%]" />
      <div className="stars absolute -left-full -z-40 mt-[56px] h-1/2 w-[400%] scale-[2]" />
      <div className="stars absolute -left-full -z-30 mt-[56px] h-1/3 w-[600%] scale-[3]" />
    </div>

    
  )
}
