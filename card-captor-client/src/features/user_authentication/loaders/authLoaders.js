import { verifyAuth } from '../services/authenticate.js';
import { redirect } from 'react-router';


// implement try catch here and in catch segregate the errors 
// if server down - show a custom page that says server down. 
// if some other error - what to do?

export async function protectedLoader(){
  try{
    const message = await verifyAuth();
    const isAuthenticated = message.authenticated;
    if(!isAuthenticated) return redirect('/login');
    else return isAuthenticated;
  }catch(error){
    if(!error.status || error.status >= 500) throw new Error("Server Unavailable. Please try again later.");
  }
}

export async function guardLoader(){
  try{
    const message = await verifyAuth();
    const isAuthenticated = message.authenticated;
    if(isAuthenticated) return redirect('/home');
  }catch(error){
    if(!error.status || error.status >= 500) throw new Error("Server Unavailable. Please try again later.");
  }
}
