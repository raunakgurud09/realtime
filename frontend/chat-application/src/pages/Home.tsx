import { useNavigate } from "react-router-dom"
import Hero from "../components/Home/Hero";
import Cta from "../components/Home/Cta";
import OSS from "../components/Home/Oss";
import Testimonials from "../components/Home/Testimonials";
import WorkingVideo from "../components/Home/WorkingVideo";
import HomeFooter from "../components/Home/Footer";

const Home = () => {

  const navigate = useNavigate();

  const handleToLogin = () => {
    navigate("/login");
  }

  return (
    <main className="overflow-auto">
      <Hero />
      <OSS />
      <Testimonials />
      <WorkingVideo />
      <HomeFooter />
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