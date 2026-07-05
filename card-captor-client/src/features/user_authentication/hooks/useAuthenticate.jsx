import { useMutation } from "@tanstack/react-query";
import {updateUser, forgotPassword, resetPassword, loginRequest, registerRequest, logoutRequest} from "../services/authenticate.js";
import { useNavigate } from "react-router";
import queryClient from "../../../shared/queryClient.js";
import { toast } from "react-toastify";

function onError(error){
    toast.error(error.message)
}

export function useLogin(){
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (payload) => loginRequest(payload),
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey:['isAuthenticated']});
            navigate('/home');
        },
        onError: (error)=> onError(error)
    }); 
}

export function useRegister(){
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (payload) => registerRequest(payload),
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey:['isAuthenticated']});
            navigate('/home');
        },
        onError: (error)=> onError(error)
    }); 
}

export function useUpdateUser(){
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (args)=> updateUser(args),
        onSuccess: async ()=> {
            await logoutRequest();
            queryClient.clear();
            navigate('/login');
        },
        onError: (error)=> onError(error)
    })
}

export function useForgotPassword(){
    return useMutation({
        mutationFn: (email)=> forgotPassword(email),
        onSuccess: ()=> toast.success('E-Mail Sent to the Provided ID'),
        onError: (error) => onError(error)
    });
}

export function useResetPassword(){
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({password, token, email}) => resetPassword(password, token, email),
        onSuccess:  ()=> {
            toast.success('Password Reset Successfully');
            navigate('/login');
        },
        onError: (error)=> onError(error)
    })
}