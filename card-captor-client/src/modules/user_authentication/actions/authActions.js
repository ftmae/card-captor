import { logoutRequest } from '../services/authenticate';
import { redirect } from 'react-router';
import queryClient from '../../../shared/queryClient.js';

export async function logoutAction(){
    await logoutRequest();
    queryClient.clear();
    return redirect('/');
}
