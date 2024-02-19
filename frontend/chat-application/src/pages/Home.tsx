import { useNavigate } from "react-router-dom"

const Home = () => {

  const navigate = useNavigate();

  const handleToLogin = () => {
    navigate("/login");
  }

  return (
    <main className="w-screen h-screen flex flex- justify-center items-center px-8 bg-black">
      <div className="w-3/5 flex flex-col items-center justify-center">
        <h1 className="text-8xl mb-8 flex-col font-bold text-violet-600">Realtime</h1>

        <div className="flex items-center flex-col">
          <p className="text-white/70 text-center px-8">A web application built with Node.js, react.js, and Socket.IO, WebRTC. The application demonstrates the integration of these technologies to create a real-time web application. This application to to go beyond basic application and implement websocket connection for scale using redis and kafka for scalability and performance </p>

          <div className="space-x-5 mt-5">
            <a className="text-primary hover:underline" target="_blank" href="https://github.com/raunakgurud09/realtime">
              Source code
            </a>
            <a className="text-primary hover:underline" target="_blank" href="https://raunakgurud.hashnode.dev/series/websockets-unlocked">
              Blog about system design
            </a>
            <a className="text-primary hover:underline" target="_blank" href="https://raunakgurud.vercel.app">
              Author
            </a>

          </div>
        </div>

        <div className="flex flex-col gap-4 w-1/4 mt-10 ">
          <button
            className='rounded-md w-full px-8 py-2 bg-violet-800 font-semibold'
            onClick={handleToLogin}
          >
            Login
          </button>
        </div>
      </div>


    </main>
  )
}

export default Home

// <div>
//           {
//             testUsers.map((t, i) => (
//               <div key={i} className="bg-blue-400/20 border rounded-md border-blue-700 px-4 py-2">
//                 <p>username - {t.username} </p>
//                 <p>password - {t.password}</p>
//               </div>
//             ))
//           }
//         </div>