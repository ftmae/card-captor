import { InvalidFieldError, MissingFieldError } from "../custom-error-handling/ValidationError.js";
export default function parseAndValidateIds(rawIds, fieldName){
    if(!rawIds) throw new MissingFieldError(fieldName);
    if(typeof rawIds === 'string') rawIds = [rawIds];
    const parsedIds = rawIds.map(id => Number.parseInt(id));
    if(parsedIds.some(id=>Number.isNaN(id))) throw new InvalidFieldError(`Invalid IDs for ${fieldName}`);
    return parsedIds
}