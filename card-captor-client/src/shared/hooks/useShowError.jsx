import { useState, useEffect } from "react";

export default function useShowError(error){
    const [showError, setShowError] = useState(null);
    
    useEffect(()=>{
        if(error){
            setShowError(true);
        }
    }, [error]);
    
    function hideError(){
        setShowError(false)
    }

    return [showError, hideError];

}