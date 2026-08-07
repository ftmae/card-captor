import jwt from 'jsonwebtoken';

export default function createJWT(id){
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' })
}