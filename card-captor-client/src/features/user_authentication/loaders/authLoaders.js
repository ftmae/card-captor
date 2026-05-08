import { verifyAuth } from '../services/authenticate.js';
import { redirect } from 'react-router';
import queryClient from '../../../shared/queryClient.js';

export async function isUserAuthenticated(){
  const user = await queryClient.fetchQuery({queryKey: ['isAuthenticated'], queryFn: verifyAuth});
  return user;
}

export async function guardLoader(){
  try{
    const user = await isUserAuthenticated();
    if(user.authenticated) return redirect('/home');
  }catch(error){
    if(!error.status || error.status >= 500) throw new Error("Server Unavailable. Please try again later.");
  }
}

export async function protectedLoader(){
  try{
    const user = await isUserAuthenticated();
    if(!user.authenticated) return redirect('/login');
    else return user;
  }catch(error){
    if(!error.status || error.status >= 500) throw new Error("Server Unavailable. Please try again later.");
  }
}