import { useMemo } from "react";

export default function useSelectAll(checked, setChecked, data){
    const isAllSelected = useMemo(()=>{
        if(!data || data.length === 0) return false;
        return data.every(item=> checked.has(item.id));
    }, [checked, data]);

    
    function onToggleSelectAll(){
        setChecked(prev=>{
            const newChecked = new Set(prev);
            if(isAllSelected){
                data.forEach(item => newChecked.delete(item.id));
            }else{
                data.forEach(item => newChecked.add(item.id));
            }
            return newChecked;
        });
    }

    return [isAllSelected, onToggleSelectAll]
};