import { InvalidFieldError, MissingFieldError } from "../custom-error-handling/ValidationError.js";

export function isValidId(id){
    if(isNaN(Number.parseInt(id))) return false;
    return true;
}

export function isValidString(str){
    if(typeof str != 'string' || str.trim() === '') return false;
    return true;
}

export default function validateFields(fields){
    fields.forEach(field=>{
        const message = `${field.name}`
        if(field.value === null || field.value === undefined) throw new MissingFieldError(message);
        if(field.type === 'id'){
            if(!isValidId(field.value)) throw new InvalidFieldError(message);
        }
        if(field.type === 'text'){
            if(!isValidString(field.value)) throw new InvalidFieldError(message);
        }
        if(field.type === "array"){
            if(field.value.length === 0) throw new InvalidFieldError(message)
        }
    });
}