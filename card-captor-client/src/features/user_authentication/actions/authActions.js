import { logoutRequest } from '../services/authenticate';
import { redirect } from 'react-router';

export async function logoutAction(){
  await logoutRequest();
  return redirect('/');
}
