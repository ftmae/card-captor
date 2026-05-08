import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next){
    const token = req.cookies.authToken;
    if(!token) {
        return res.json({ authenticated: false });
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