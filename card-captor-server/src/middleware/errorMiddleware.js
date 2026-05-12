import { ApiError } from "@google/genai";
import { Prisma } from "../../generated/prisma/client.ts";
import { InvalidFieldError, MissingFieldError } from "../custom-error-handling/ValidationError.js";
import { RecordAlreadyExistsError, RecordNotFoundError } from "../custom-error-handling/DbError.js";
import logger from '../logger/logger.js';

export default function errorMiddleware(err, req, res, next){
    logger.error(err);

    if(err instanceof SyntaxError){
        return res.status(400).json({error: "Could Not Parse as JSON"});
    }

    if(err instanceof ApiError){
        if(err.status === 429){
            return res.status(429).json({error: "AI Model Currently Unavailable. Please try again after some time."});
        }
        if(err.status === 400){
            return res.status(403).json({error: "Authorization Failure. Cannot Access AI Model"});
        }
    }

    if(err instanceof MissingFieldError){
        return res.status(400).json({error: err.message});
    }

    if(err instanceof InvalidFieldError){
        return res.status(400).json({error: err.message});
    }

    if(err instanceof RecordAlreadyExistsError){
        return res.status(400).json({error: "Record Already Exists"});
    }

    if(err instanceof RecordNotFoundError){
        return res.status(404).json({error: "Record Not Found"});
    }

    if(err instanceof Prisma.PrismaClientInitializationError || err instanceof Prisma.PrismaClientRustPanicError){
        return res.status(503).json({error: "Database Currently Unavailable"});
    }
    
    if(err instanceof Prisma.PrismaClientValidationError){
        return res.status(400).json({error: "Invalid Database Fields"});
    }

    if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code === 'P2002'){
            return res.status(409).json({error: "Record Already Exists"});
        }
        if(err.code === 'P2025'){
            return res.status(404).json({error: "Operation Failed. Record Not Found"});
        }
        else{
            return res.status(404).json({error: "Database Request Error"});
        }
    }
    // if(err.instanceof PayloadTooLargeError)
    return res.status(500).json({error: "An Unexpected Error Occurred. Operation Failed"});
}