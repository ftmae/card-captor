import { createBrowserRouter, RouterProvider, Navigate, redirect, useSearchParams, useRouteError } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './shared/queryClient.js';
import FlashcardSourceForm from './features/flashcard_generation/components/FlashcardSourceForm/FlashcardSourceForm.jsx';
import Flashcards from './features/flashcard_management/components/Flashcards/Flashcards.jsx';
import Home from './features/home/Home/Home.jsx';
import DeckList from './features/deck_management/components/DeckList/DeckList.jsx';
import MainLayout from './layout/MainLayout.jsx';
import { guardLoader, protectedLoader } from './features/user_authentication/loaders/authLoaders.js';
import { logoutAction } from './features/user_authentication/actions/authActions.js';
import Landing from './features/landing/Landing/Landing.jsx';
import DeckSelection from './features/spaced_repetition/components/DeckSelection.jsx';
import { ToastContainer, Flip } from 'react-toastify';
import { BadgeCheck, CircleAlert, BadgeInfo } from 'lucide-react';
import NotFound from './layout/NotFound.jsx';
import StudyCards from './features/spaced_repetition/components/StudyCards.jsx';
import UpdateUserDetails from './features/user_authentication/components/UpdateUserDetails.jsx';
import PasswordForm from './features/user_authentication/components/PasswordForm.jsx';
import LoginForm from './features/user_authentication/components/LoginForm.jsx';
import RegisterForm from './features/user_authentication/components/RegisterForm.jsx';

function ErrorBoundary() {
  let error = useRouteError();
  console.log(error);
  return (
    <div className="flex-container-center min-height-100vh flex-column">
      <h1 className="fs-600 ff-serif">Something Went Wrong</h1>
      <p className="fs-450">{error.message}</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    loader: guardLoader,
    element: <Landing />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/login',
    loader: guardLoader,
    element: <LoginForm />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/register',
    loader: guardLoader,
    element: <RegisterForm />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/forgotPassword',
    loader: guardLoader,
    element: <PasswordForm type="forgot" />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/resetPassword',
    loader: guardLoader,
    element: <PasswordForm type="reset" />,
    errorElement: <ErrorBoundary />
  },
  {
    element: <MainLayout />,
    id: 'root-protected',
    loader: protectedLoader,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/generate_flashcards',
        element: <FlashcardSourceForm />,
      },
      { 
        path: '/flashcards',
        element: <Flashcards />,
      },
      {
        path: '/decks',
        element: <DeckList />,
      },
      {
        path: '/deck_selection',
        element: <DeckSelection />,
      },
      {
        path: '/study',
        element: <StudyCards />,
      },
      {
        path: '/manage_account',
        element: <UpdateUserDetails />,
      }
    ]
  },
  {
    path: '/logout',
    action: logoutAction,
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
        icon={({type})=>{
          switch(type){
            case 'error': return <CircleAlert className="text-error-dark" />
            case 'success': return <BadgeCheck className="text-success-dark"/>
            case 'info': return <BadgeInfo className="text-info-dark"/>
          }
        }}
      />
    </QueryClientProvider>
  )
}