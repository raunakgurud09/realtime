import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { FaEye } from 'react-icons/fa6'

export const Login = () => {

  const { login } = useAuth()
  const [visible, setVisible] = useState(false)


  const [data, setData] = useState({
    username: "",
    password: ""
  })

  const handleDataChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [name]: e.target.value
    })
  }


  const handleLogin = async () => { await login(data) }


  return (
    <div className="pointer-events-none relative flex h-screen flex-col items-center justify-center gap-8 overflow-hidden [&>*]:pointer-events-auto">

      <div className="absolute left-0 z-30 h-screen max-w-2xl w-full p-8 px-28 flex justify-center items-start gap-5 flex-col bg-dark shadow-md bg-black">

        <div className='flex flex-col item-start'>
          <h1 className="text-4xl flex-col font-bold text-violet-600">
            Realtime
          </h1>
          <p className='text-xs font-medium text-white/80'>Welcome! Sign in to your account</p>
        </div>

        {/* input for entering the username */}
        <div className='flex flex-col w-full space-y-2'>

          <div className="w-full space-y-1">
            <label className='text-sm'>Username</label>
            <input
              type='email'
              placeholder='you@exampl.com'
              value={data.username}
              className='"block w-full h-10 rounded-md outline outline-[1px] text-white/80  focus:ring-1  drop-shadow-xl placeholder:text-sm placeholder:text-white/30  outline-zinc-400/30  px-5 bg-zinc-800/30 text-white  placeholder:text-white/70",'
              onChange={handleDataChange("username")}
            />
          </div>

          <div className="w-full relative">
            <label className='text-sm'>Password</label>
            <input
              type={visible ? 'text' : 'password'}
              placeholder='**********'
              value={data.password}
              className='"block w-full h-10 rounded-md outline outline-[1px] text-white/80  focus:ring-1  drop-shadow-xl placeholder:text-sm placeholder:text-white/30  outline-zinc-400/30  px-5 bg-zinc-800/30 text-white  placeholder:text-white/70",'
              onChange={handleDataChange("password")}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogin();
                else return;
              }}
            />
            <FaEye onClick={() => { setVisible((prev) => !prev) }} className="text-white/70  hover:cursor-pointer absolute right-4 top-9" />
          </div>
          {/* Button to initiate the login process */}
        </div>
        <button
          className='rounded-md w-full px-8 py-2 bg-violet-800 font-semibold'
          onClick={handleLogin}
        >
          Login
        </button>

        {/* Link to the registration page */}
        <div className='w-full flex flex-col space-y-1 justify-center items-center'>
          <small className="text-zinc-300">
            Don&apos;t have an account?{" "}
            <a className="text-primary hover:underline" href="/register">
              Register
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

      {/* stars move */}
      <div className="stars absolute -left-full -z-50 mt-[56px] h-screen w-[200%]" />
      <div className="stars absolute -left-full -z-40 mt-[56px] h-1/2 w-[400%] scale-[2]" />
      <div className="stars absolute -left-full -z-30 mt-[56px] h-1/3 w-[600%] scale-[3]" />
    </div>
  )
}
