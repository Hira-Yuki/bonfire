import reset from "styled-reset"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { styled, createGlobalStyle } from "styled-components"
import { useEffect, useState } from "react"
import { auth } from "./firebase"
import Layout from "./components/Layout"
import Home from "./routes/Home"
import Profile from "./routes/Profile"
import Login from "./routes/Login"
import CreateAccount from "./routes/CreateAccount"
import LoadingScreen from "./components/LoadingScreen"
import ProtectedRoute from "./components/ProtectedRoute"

/**
 * @todo 코드 스플리팅과 컴포넌트 분할 시도할 것 
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <CreateAccount />
  }
])

function App() {
  const [isLoading, setLoading] = useState(true)
  const init = async () => {
    await auth.authStateReady()
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])


  return (
    <Wrapper>
      <GlobalStyles />
      {
        isLoading
          ? <LoadingScreen />
          : <RouterProvider router={router} />
      }
    </Wrapper>
  )
}

export default App

/**
 * global CSS reset
 */
const GlobalStyles = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    background-color: #2b2b2b;
    color: #d3d3d3;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  }
`

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`