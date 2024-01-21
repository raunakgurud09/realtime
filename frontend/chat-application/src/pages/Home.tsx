import { useNavigate } from "react-router-dom"

const Home = () => {

  const navigate = useNavigate();

  const handleToLogin = () => {
    navigate("/login");
  }
  const handleToRegister = () => {
    navigate("/login");
  }



  return (
    <main className="w-screen h-screen flex flex- justify-center items-center px-8">
      <div className="w-2/5 flex flex-col items-start justify-center">
        <h1 className="text-8xl mb-48 flex-col font-bold text-violet-600">Realtime</h1>
        <div className="flex flex-col gap-4 w-3/4 ">
          <button
            className='rounded-md w-full px-8 py-2 bg-violet-800 font-semibold'
            onClick={handleToLogin}
          >
            Login
          </button>
          <button
            className='rounded-md w-full px-8 py-2 bg-violet-800 font-semibold'
            onClick={handleToRegister}
          >
            Register
          </button>
        </div>
      </div>

      <div className="w-3/5 pointer-events-none relative -mt-[56px] flex h-screen flex-col items-center justify-center gap-8 overflow-hidden [&>*]:pointer-events-auto">
        <div className="stars absolute -left-full -z-50 mt-[56px] h-screen w-[200%]" />
        <div className="stars absolute -left-full -z-40 mt-[56px] h-1/2 w-[400%] scale-[2]" />
        <div className="stars absolute -left-full -z-30 mt-[56px] h-1/3 w-[600%] scale-[3]" />
        <img src="/public/chat-page.png" alt="chat-page" className="z-30 w-[500px] h-[234px] hover:scale-[1.01]   border rounded-md object-cover absolute bottom-48 left-[20px]" />
        <img src="/public/login-page.png" alt="login-page" className="z-40 w-[500px] h-[234px] hover:scale-[1.01] border rounded-md object-contain absolute bottom-8" />
        <img src="/public/chat-modal.png" alt="chat-modal" className="z-20 w-[500px]  h-[234px] hover:scale-[1.01]  border rounded-md object-contain absolute top-[100px] right-2" />
      </div>

    </main>
  )
}

export default Home