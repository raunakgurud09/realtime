import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export const Login = () => {

  const { login } = useAuth()

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


  const handleLogin = async () => { console.log('submitted'); await login(data) }
  // const handleLogin = async () => { console.log('submitted') }


  return (
    <div className="flex justify-center items-center flex-col h-screen w-screen">
      <h1 className="text-3xl font-bold">FreeAPI Chat App</h1>
      <div className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]">
        <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
          {/* <LockClosedIcon className="h-8 w-8 mb-2" /> Login */}
        </h1>
        {/* input for entering the username */}
        <input
          placeholder="Enter the username..."
          value={data.username}
          className='"block w-full rounded-xl outline outline-[1px] outline-zinc-400 border-0 py-4 px-5 bg-secondary text-white font-light placeholder:text-white/70",'
          onChange={handleDataChange("username")}
        />
        {/* input for entering the password */}
        <input
          placeholder="Enter the password..."
          type="password"
          className='"block w-full rounded-xl outline outline-[1px] outline-zinc-400 border-0 py-4 px-5 bg-secondary text-white font-light placeholder:text-white/70",'
          value={data.password}
          onChange={handleDataChange("password")}
        />
        {/* Button to initiate the login process */}
        <button
          className='rounded-md w-full px-8 py-4 bg-violet-800'
          // disabled={Object.values(data).some((val) => !val)}
          // fullWidth
          onClick={handleLogin}
        >
          Login
        </button>
        {/* Link to the registration page */}
        <small className="text-zinc-300">
          Don&apos;t have an account?{" "}
          <a className="text-primary hover:underline" href="/register">
            Register
          </a>
        </small>
      </div>
    </div>
  )
}
