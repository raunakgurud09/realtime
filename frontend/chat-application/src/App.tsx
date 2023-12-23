import { Route, Routes } from "react-router-dom"
import { PublicRoute } from "./components/PublicRoute"
import { Register } from "./pages/Register"
import { PrivateRoute } from "./components/PrivateRoute"
import { Login } from "./pages/Login"
import { Chat } from "./pages/chat"

function App() {

  return (
    <Routes>

      {/* private route */}
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
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
        path="/register"
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
