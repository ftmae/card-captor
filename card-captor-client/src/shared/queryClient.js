import { QueryClient, QueryCache } from "@tanstack/react-query";
import HttpError from './error-classes/HttpError.js';
import { toast } from 'react-toastify';

const queryClient = new QueryClient({
    defaultOptions:{
        queries: {
            staleTime: 1000 * 60 * 5
        }
    },
    queryCache: new QueryCache({
        onError: (error) => {
            if(error.status === 401 && error instanceof HttpError) return
            toast.error(error.message)
        }
    })
});

export default queryClient