import React from 'react'
import Loader from './Loader'

export const LoadingPage = () => {
  return (
    <div className='h-screen w-screen bg-zinc-950 flex flex-col items-center justify-start '>
      <div className='mt-60 flex flex-col w-fit justify-center items-start space-y-3'>
        <h1 className="text-8xl flex-col font-bold text-violet-600">
          Realtime
        </h1>
        <div className='ml-2 flex space-x-2 items-center  justify-center text-white/50'>
          <Loader />
          <p className='text-lg'>Loading realtime.io</p>
        </div>
      </div>
    </div>
  )
}
