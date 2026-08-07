import jwt from "jsonwebtoken";

function authMiddlewareBase(req, res, next, optional){
    const token = req.cookies.authToken;
    if(!token) {
        if(optional) return res.status(200).json({authenticated: false});
        else return res.status(401).json({"error": "Invalid Token"});
    }
    try{
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if(err){
                return res.status(401).json({"error": "Invalid Token"});
            }
            req.userId = decoded.id;
            next();

        })
    }catch(error){
        res.status(500).json({"error": "Request Failed"});
    }
}

export default function authMiddleware(req, res, next){
    authMiddlewareBase(req, res, next, false)
}

export function optionalAuthMiddleware(req, res, next){
    authMiddlewareBase(req, res, next, true)
}