import express from 'express';
import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js';
import asyncErrorWrapper from '../utils/asyncErrorWrapper.js';
import validateFields from '../utils/validation.js';
import { RecordAlreadyExistsError, RecordNotFoundError } from '../custom-error-handling/DbError.js';
import { InvalidFieldError } from '../custom-error-handling/ValidationError.js';

const router = express.Router();

router.post('/register', asyncErrorWrapper(
    async (req, res) => {
        
        const { username, password, email } = req.body;
        validateFields([
            {value: username, name: "Username", type: "text"},
            {value: password, name: "Password", type: "text"},
            {value: email, name: "Email", type: "text"},
        ]);
        const hashedPassword = await bcrypt.hash(password, 8);

        const userExists = await prisma.user.findUnique({
            where: { username }
        });

        if (userExists) throw new RecordAlreadyExistsError(`User - ${user}`);

        const emailExists = await prisma.user.findUnique({
            where: {
                email,
            }
        });
        if (emailExists) throw new RecordAlreadyExistsError(`E-Mail - ${email}`);

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

        return res.status(200).json({ message: "Authentication Successful" });
    }
));

router.post('/login', asyncErrorWrapper(
    async (req, res) => {
        const { username, password } = req.body;
        validateFields([
            {value: username, name: "Username", type: "text"},
            {value: password, name: "Password", type: "text"},
        ]);

        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) throw new RecordNotFoundError(`User - ${user}`);

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) throw new InvalidFieldError(`Password`);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie("authToken", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });

        return res.status(200).json({ message: "Authentication Successful" });
    }
));


router.get('/user', authMiddleware, (req, res) => {
    res.status(200).json({
        authenticated: true,
        userId: req.userId,
    })
})

router.post('/logout', authMiddleware, (req, res) => {
    try {
        res.clearCookie('authToken');
        return res.status(200).json({ message: 'Logged Out Successfully', 'authenticated': false });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Logout failed. Please try again.' })
    }
});

export default router;