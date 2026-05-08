const asyncErrorWrapper = (func) =>{
    return async (req, res, next) =>{
        try{
            await func(req, res, next);
        }
        catch(error){
            next(error);
        }
    }
}

export default asyncErrorWrapper;