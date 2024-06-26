import React, { Suspense, useEffect, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { auth } from './firebase';
import LoadingScreen from './components/LoadingScreen'
import ProtectedRoute from './components/ProtectedRoute'
import { styled } from '@linaria/react'
import './reset.css'
import Search from './routes/Search';
import Notices from './routes/Notices';
import Detail from './routes/Detail';
import NotFound from './routes/NotFound';

// 동적 임포트를 사용하여 코드 스플리팅
const Layout = React.lazy(() => import('./components/Layout'));
const Home = React.lazy(() => import('./routes/Home'));
const Profile = React.lazy(() => import('./routes/Profile'));
const Login = React.lazy(() => import('./routes/Login'));
const CreateAccount = React.lazy(() => import('./routes/CreateAccount'))
const ResetPassword = React.lazy(() => import('./routes/ResetPassword'))

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout />
    ),
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />} >
              <Home />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />} >
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'search',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />} >
              <Search />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'notices',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />} >
              <Notices />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/post/:id',
        element: (
          <Suspense fallback={<LoadingScreen />} >
            <Detail />
          </Suspense>
        ),
      },
      {
        path: '/not-found',
        element: (
          <Suspense fallback={<LoadingScreen />} >
            <NotFound />
          </Suspense>
        ),
      },
      {
        // 지정되지 않은 주소로 이동하려 할 경우 404 컴포넌트를 보여줌
        // 주소를 리다이렉트하지 않음.
        path: '*',
        element: (
          <Suspense fallback={<LoadingScreen />} >
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Login />
    ),
  },
  {
    path: '/create-account',
    element: (
      <CreateAccount />
    ),
  },
  {
    path: '/reset-password',
    element: (
      <ResetPassword />
    ),
  },
])

function App() {
  const [isLoading, setLoading] = useState(true)

  const init = async () => {
    await auth.authStateReady()
    setLoading(false)
  };

  useEffect(() => {
    init()
  }, [])

  return (
    <Wrapper>
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper >
  );
}

export default App

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`;