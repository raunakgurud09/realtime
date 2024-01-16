import { useNavigate } from 'react-router-dom'

export const NotFound = () => {

  const navigate = useNavigate()

  const handleRedirectToHome = () => {
    navigate('/')
  }

  return (
    <div className="pointer-events-none relative -mt-[56px] flex h-screen flex-col items-center justify-center gap-8 overflow-hidden [&>*]:pointer-events-auto">
      <div className="stars absolute -left-full -z-50 mt-[56px] h-screen w-[200%]" />
      <div className="stars absolute -left-full -z-40 mt-[56px] h-1/2 w-[400%] scale-[2]" />
      <div className="stars absolute -left-full -z-30 mt-[56px] h-1/3 w-[600%] scale-[3]" />
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-4 font-mono text-4xl font-bold leading-tight  text-white opacity-30 md:text-9xl">
          404
        </h1>
        <p className="px-6 text-center font-mono text-base text-white opacity-30 md:px-0 md:text-xl">
          This route doesn't exists
        </p>
        <button
          className="mt-8 px-8 py-2 border border-white/60 font-medium rounded-md bg-white/10"
          onClick={handleRedirectToHome}
        >
          Home
        </button>
      </div>
    </div>
  )
}
