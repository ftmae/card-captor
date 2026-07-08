import express from 'express';
import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js';
import asyncErrorWrapper from '../utils/asyncErrorWrapper.js';
import validateFields from '../utils/validation.js';
import {generateRandomToken, hashToken} from '../utils/generateToken.js';
import { RecordAlreadyExistsError, RecordNotFoundError } from '../custom-error-handling/DbError.js';
import { InvalidFieldError } from '../custom-error-handling/ValidationError.js';
import transporter from '../utils/email.js';
import dayjs from 'dayjs';

const router = express.Router();
const isProduction = process.env.NODE_ENV === 'production';

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
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'Lax'
        });

        return res.status(200).json({ message: "Authentication Successful" });
    }
));


router.post('/login', asyncErrorWrapper(
    async (req, res) => {
        const loginType = req.body.loginType;
        const password = req.body.password;

        async function findUser(type){
            const value = req.body[type];
            const name = type === "username" ? 'Username' : "E-Mail";
            validateFields([{ value, name, type: "text"}]);
            return await prisma.user.findUnique({
                where: { [type]: value }
            });
        }

        const user = await findUser(loginType);
        if (!user) throw new RecordNotFoundError(`User - ${user}`);

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) throw new InvalidFieldError(`Password`);
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie("authToken", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'Lax'
        });

        return res.status(200).json({ message: "Authentication Successful" });
    }
));

router.get('/user', authMiddleware, asyncErrorWrapper(
    async (req, res) => {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            }
        });
        res.status(200).json({
            authenticated: true,
            userId: req.userId,
            username: user.username,
        });
    }
))

router.put('/user', authMiddleware, asyncErrorWrapper(
    async (req, res) => {
        const type = req.body.type;
        const password = req.body.password;
        const id = req.userId;

        validateFields([
            {type: 'text', value: password, name: 'Password'},
            {type: 'id', value: id, name: 'User ID'},
        ]);

        const user = await prisma.user.findUnique({ where: { id } });
        const passwordIsValid = await bcrypt.compare(password, user.password);
        
        if(!passwordIsValid) throw new InvalidFieldError(`Password`);

        if(type === 'username'){
            const username = req.body.username;
            validateFields([ {type: 'text', value: username, name: 'Username'} ]);

            const user = await prisma.user.findUnique({
                where: { username }
            });
            
            if(user) throw new RecordAlreadyExistsError(`Username - ${username}`);
            else{
                const updatedUser = await prisma.user.update({ 
                    where: { id },
                    data: { username }
                }); 
                return res.status(200).json({message: "Username Updated Successfully"});
            }
        }
        else if (type==='password') {
            const newPassword = req.body.newPassword;
            validateFields([ {type: 'text', value: newPassword, name: 'New Password'} ]);
            if (user.password === newPassword) console.log('Update Not Required');
            else {
                const hashedPassword = await bcrypt.hash(newPassword, 8);
                const updatedUser = await prisma.user.update({
                    where: { id },
                    data: { password: hashedPassword }
                });
                return res.status(200).json({message: "Password Updated Successfully"});
            }
        }
    }
))

router.post('/logout', authMiddleware, (req, res) => {
    try {
        res.clearCookie('authToken', {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'Lax'
        });
        return res.status(200).json({ message: 'Logged Out Successfully', 'authenticated': false });
    }
    catch (error) {
        return res.status(500).json({ error: 'Logout failed. Please try again.' })
    }
});

router.post('/forgotPassword', asyncErrorWrapper(
    async (req, res) => {
        const email = req.body.email;

        validateFields([
            {type: 'text', value: email, name: 'E-Mail'},
        ]);

        const user = await prisma.user.findUnique({ where: { email } });
        if(!user) return res.status(200).json({message: "If your email is registered you will receive a mail shortly"});
        const token = await generateRandomToken();
        const tokenHash = hashToken(token);
        const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.user.update({
            where: {email},
            data: { resetPasswordToken: tokenHash, resetPasswordTokenAt: tokenExpiresAt }
        });

        const url = `${process.env.FRONTEND_URL}/resetPassword?token=${token}&email=${email}`;
        await transporter.sendMail({
            from: '"Card Captor" <moaiyadi.fatemaabbas@gmail.com>' ,
            to: email,
            subject: "Password Reset URL",
            text: `To reset your password, please click on the following link: ${url}`,
            html: `
                <p>You requested a password reset for your account with Card Captor</p>
                <p>Click on the following URL to be redirected to the password reset page</p>
                <a href="${url}">Reset Password</a>
            `
        });
        return res.status(200).json({message: "If your email is registered you will receive a mail shortly"});
    }
));

router.post('/resetPassword', asyncErrorWrapper(
    async(req, res) => {
        const {password, token, email} = req.body; 
    
        validateFields([
            {name: "New Password", value: password, type: 'text'},
            {name: "E-Mail", value: email, type: 'text'},
            {name: "Token", value: token, type: 'text'},
        ]);

        const tokenHash = hashToken(token);
        const user = await prisma.user.findUnique({
            where: { email }
        });
        const now = dayjs();
        const tokenExpiresAt = dayjs(user.resetPasswordTokenAt);

        if(now.isAfter(tokenExpiresAt.add(10, 'm'))) return res.status(403).json({message: 'Token Has Expired'});
        if((user.resetPasswordToken != tokenHash)) return res.status(403).json({message: 'Invalid Token'});

        const hashedPassword = await bcrypt.hash(password, 8);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        return res.status(200).json({message: 'Password Updated Successfully'});
    }
))

export default router;