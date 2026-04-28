import express from 'express';
import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

function verifyRequiredFields(req, res, fields) {
    for (const field in fields){
        if (!req.body[fields[field]]) return false
    }
    return true;
}
router.post('/register', async (req, res) => {
    try {
        if(!verifyRequiredFields(req, res, ['username', 'password', 'email'])){
            return res.status(400).json({ "error": "Missing Required Fields" });
        }

        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);

        const userExists = await prisma.user.findUnique({
            where: { 
                username,
            }
        });

        if (userExists) return res.status(400).json({ error: 'User Already Exists' });
        
        const emailExists = await prisma.user.findUnique({
            where: { 
                email,
            }
        });

        if (emailExists) return res.status(400).json({ error: 'E-Mail is Already Registered' });

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                email: email
            }
        });

       await prisma.deck.create({
            data: {
                name: 'Your First Deck',
                userId: newUser.id
            }
        })

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie("authToken", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });

        return res.status(200).json({ "message": "Authentication Successful" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Registration failed. Please try again.' })
    }
});

router.post('/login', async (req, res) => {
    try {
         if(!verifyRequiredFields(req, res, ['username', 'password'])){
            return res.status(400).json({ "error": "Missing Required Fields" });
        }
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) return res.status(400).json({ error: 'User Not Found' });

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) return res.status(400).json({ error: 'Invalid Credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie("authToken", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });

        return res.status(200).json({ "message": "Authentication Successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Login failed. Please try again.' })
    }
});


router.get('/user', authMiddleware, (req, res)=>{
    res.status(200).json({
        authenticated: true, 
        userId: req.userId,
    })
})

router.post('/logout', authMiddleware, (req, res)=>{
    try{
        res.clearCookie('authToken');
        return res.status(200).json({'message': 'Logged Out Successfully', 'authenticated' : false});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({'error': 'Logout failed. Please try again.'})
    }
})

export default router;