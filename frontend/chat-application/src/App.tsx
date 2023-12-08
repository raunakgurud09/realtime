import { Route, Routes } from "react-router-dom"
import { PublicRoute } from "./components/PublicRoute"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Chat } from "./pages/Chat"

function App() {

  return (
    <Routes>

      {/* private route */}
      <Route
        path="/chat"
        element={
          <Chat />
        }
      >
      </Route>

      {/* login route  */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      >
      </Route>

      {/* register route  */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      >
      </Route>



      {/* All unwanted routes */}
      <Route path="*" element={<p>404 Not found</p>} />
    </Routes>
  )
}

export default App
