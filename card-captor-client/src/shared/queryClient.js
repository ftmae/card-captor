import { QueryClient, QueryCache } from "@tanstack/react-query";
import { toast } from 'react-toastify';

const queryClient = new QueryClient({
    defaultOptions:{
        queries: {
            staleTime: 1000 * 60 * 5
        }
    },
    queryCache: new QueryCache({
        onError: (error) => toast.error(error.message)
    })
});

export default queryClient