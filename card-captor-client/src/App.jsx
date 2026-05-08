import { createBrowserRouter, RouterProvider, Navigate, redirect, useSearchParams, useRouteError } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './shared/queryClient.js';
import FlashcardSourceForm from './features/flashcard_generation/components/FlashcardSourceForm/FlashcardSourceForm.jsx';
import Flashcards from './features/flashcard_management/components/Flashcards/Flashcards.jsx';
import AuthForm from './features/user_authentication/components/AuthForm/AuthForm.jsx';
import Home from './features/home/Home/Home.jsx';
import DeckList from './features/deck_management/components/DeckList/DeckList.jsx';
import MainLayout from './layout/MainLayout.jsx';
import { guardLoader, protectedLoader } from './features/user_authentication/loaders/authLoaders.js';
import { logoutAction } from './features/user_authentication/actions/authActions.js';
import Landing from './features/landing/Landing/Landing.jsx';


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
    element: <AuthForm />,
    errorElement: <ErrorBoundary />
  },
  {
    element: <MainLayout />,
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
      }
    ]
  },
  {
    path: '/logout',
    action: logoutAction,
  }
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}