import { Route, Routes } from "react-router-dom"
import { PublicRoute } from "./components/PublicRoute"
import { Register } from "./pages/Register"
import { PrivateRoute } from "./components/PrivateRoute"
import { Login } from "./pages/Login"
import { Chat } from "./pages/chat"
import { NotFound } from "./pages/not-found"
import Home from "./pages/Home"

function App() {

  return (
    <Routes>

      <Route
        path="/"
        element={
          <Home />
        }
      >

      </Route>

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
