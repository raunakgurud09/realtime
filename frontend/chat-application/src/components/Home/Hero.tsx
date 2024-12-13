import MaxContainer from '../Common/MaxContainer'
import HeroBackground from '../Common/HeroBackground'
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  const handleToLogin = () => {
    navigate("/login");
  }

  return (
    <MaxContainer>
      <div className='flex flex-col w-full mt-28 mb-56'>
        <HeroBackground />
        <div className='flex flex-col  w-full justify-center items-center'>
          <div className="w-[60%]">
            <h1 className='text-3xl sm:text-6xl my-10 text-center mt-40'>
              Streamline
              <span className='inline-flex px-2 text-violet-500'>
                Real-Time
              </span>
              Collaboration
            </h1>
            <p className='text-lg selection:bg-accent text-center'>Power your applications with cutting-edge real-time technology. </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-10 justify-center items-center w-full">
          <button
            className='rounded-md w-full max-w-48 px-8 py-2 bg-violet-800 font-semibold'
            onClick={handleToLogin}
          >
            Login
          </button>
        </div>
      </div>
    </MaxContainer>
  )
}
