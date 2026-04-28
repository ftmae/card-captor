import { createBrowserRouter, RouterProvider, Navigate, redirect, useSearchParams } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import FlashcardSourceForm from './features/flashcard_generation/components/FlashcardSourceForm/FlashcardSourceForm.jsx';
import Flashcards from './features/flashcard_management/components/Flashcards/Flashcards.jsx';
import AuthForm from './features/user_authentication/components/AuthForm/AuthForm.jsx';
import Home from './features/home/Home/Home.jsx';
import DeckList from './features/deck_management/components/DeckList/DeckList.jsx';
import MainLayout from './layout/MainLayout.jsx';
import { guardLoader, protectedLoader } from './features/user_authentication/loaders/authLoaders.js';
import { logoutAction } from './features/user_authentication/actions/authActions.js';
import { flashcardLoader } from './features/flashcard_management/loaders/flashcardLoaders.js';
import { deckLoader } from './features/deck_management/loaders/deckLoaders.js';

const router = createBrowserRouter([
  {
    path: '/',
    loader: guardLoader,
    element: <AuthForm />,
  },
  {
    element: <MainLayout />,
    loader: protectedLoader,
    errorElement: <Navigate to="/" />,
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
        loader: flashcardLoader
      },
      {
        path: '/decks',
        element: <DeckList />,
        loader: deckLoader
      }
    ]
  },
  {
    path: '/logout',
    action: logoutAction,
  }
]);

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}