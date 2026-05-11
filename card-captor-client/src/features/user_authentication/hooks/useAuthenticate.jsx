import { useMutation } from "@tanstack/react-query";
import authRequest from "../services/authenticate";
import { useNavigate } from "react-router";
import queryClient from "../../../shared/queryClient.js";
import { toast } from "react-toastify";


export default function useAuthenticate(){
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: authRequest,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['isAuthenticated']});
            navigate('/home');
        },
        onError: (error)=> toast.error(error.message)
    });  
}