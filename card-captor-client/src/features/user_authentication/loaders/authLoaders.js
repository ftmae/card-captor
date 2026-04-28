import { verifyAuth } from '../services/authenticate.js';
import { redirect } from 'react-router';

export async function protectedLoader(){
  const message = await verifyAuth();
  const isAuthenticated = message.authenticated;
  if(!isAuthenticated) return redirect('/');
  else return isAuthenticated;
}

export async function guardLoader(){
  const message = await verifyAuth();
  const isAuthenticated = message.authenticated;
  if(isAuthenticated) return redirect('/home');
}
