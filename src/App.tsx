import React, { Suspense, useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import reset from 'styled-reset';
import { auth } from './firebase';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';

// 동적 임포트를 사용하여 코드 스플리팅
const Layout = React.lazy(() => import('./components/Layout'));
const Home = React.lazy(() => import('./routes/Home'));
const Profile = React.lazy(() => import('./routes/Profile'));
const Login = React.lazy(() => import('./routes/Login'));
const CreateAccount = React.lazy(() => import('./routes/CreateAccount'));
const ResetPassword = React.lazy(() => import('./routes/ResetPassword'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <Home />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/create-account',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <CreateAccount />
      </Suspense>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <ResetPassword />
      </Suspense>
    ),
  },
]);

function App() {
  const [isLoading, setLoading] = useState(true);
  
  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;

const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      ${resetStyles}
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
      ::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.append(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return null;
};

const resetStyles = css`
  ${reset.toString()}
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`;