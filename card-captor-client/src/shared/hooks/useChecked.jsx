import { useState, useEffect } from "react";
export default function useChecked(data){
    const [checked, setChecked] = useState(new Set());
    
    useEffect(()=>{
        if(checked.size === 0 && data?.length > 0) setChecked(new Set([data[0].id]))
    }, [data]);

    function handleOnChange(event){
        const id = Number.parseInt(event.target.value);
        setChecked(prev=>{
            const newChecked = new Set(prev);
            prev.has(id) ? newChecked.delete(id) : newChecked.add(id);
            return newChecked;
        })
    }
    return [checked, setChecked, handleOnChange];
}