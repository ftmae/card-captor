import IconTextButton from "../IconTextButton/IconTextButton"

export default function BulkDelete({data, isDeleteMode, setIsDeleteMode, isAllSelected, onConfirmDelete, onToggleSelectAll, disabled, deleteLabel="Delete"}){
    return(
        <>
            {data?.length > 0 &&
                <IconTextButton 
                    onClick={()=>setIsDeleteMode(prev=> !prev)} 
                    disabled={disabled} 
                    icon={isDeleteMode ? 'close_small' : 'delete'} 
                    text={isDeleteMode ? '' : deleteLabel}
                    style='bg-light-3 text-dark-2 border-dark-1'
                />
            }
            {isDeleteMode &&
                <>
                    <IconTextButton 
                        onClick={onConfirmDelete} 
                        disabled={disabled} 
                        icon={'delete'} 
                        text={''}
                        style='bg-dark-1 text-white border-trans' 
                    />
                    <IconTextButton 
                        onClick={onToggleSelectAll} 
                        disabled={disabled} 
                        icon={isAllSelected ? 'deselect' : 'select_all'} 
                        text={isAllSelected ? 'Deselect All' : 'Select All'}
                        style='bg-dark-1 text-white border-trans' 
                    />
                </>
            }
        </>
    )
}