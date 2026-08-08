import express from 'express';
import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import authMiddleware from '../middleware/authMiddleware.js';
import {optionalAuthMiddleware} from '../middleware/authMiddleware.js';
import asyncErrorWrapper from '../utils/asyncErrorWrapper.js';
import validateFields from '../utils/validation.js';
import { setCookie, clearCookie } from '../utils/cookies.js';
import {generateRandomToken, hashToken} from '../utils/generateToken.js';
import { RecordAlreadyExistsError, RecordNotFoundError } from '../custom-error-handling/DbError.js';
import { InvalidFieldError } from '../custom-error-handling/ValidationError.js';
import InvalidTokenError from '../custom-error-handling/InvalidTokenError.js';
import createJWT from '../services/jwt.js';
import transporter from '../services/email.js';
import dayjs from 'dayjs';

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
const FIFTEEN_MINS = 15 * 60 * 1000;
const PASSWORD_HASH = 8;
const router = express.Router();

async function createRefreshToken(){
    const refreshToken = await generateRandomToken();
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + THIRTY_DAYS);
    return {refreshToken, refreshTokenHash, expiresAt};
}

router.post('/register', asyncErrorWrapper(
    async (req, res) => {
        const { username, password, email } = req.body;
        validateFields([
            {value: username, name: "Username", type: "text"},
            {value: password, name: "Password", type: "text"},
            {value: email, name: "Email", type: "text"},
        ]);
        const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH);

        const userExists = await prisma.user.findUnique({
            where: { username }
        });

        if (userExists) throw new RecordAlreadyExistsError(`User - ${username}`);

        const emailExists = await prisma.user.findUnique({
            where: { email }
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

        const authToken = createJWT(newUser.id);
        const {refreshToken, refreshTokenHash, expiresAt} = await createRefreshToken();

        await prisma.refreshToken.create({
            data: {
                refreshToken: refreshTokenHash,
                expiresAt,
                userId: newUser.id,
            }
        })

        setCookie(res, "authToken", FIFTEEN_MINS, authToken);
        setCookie(res, "refreshToken", THIRTY_DAYS, refreshToken);
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
        
        const authToken = createJWT(user.id);
        const {refreshToken, refreshTokenHash, expiresAt} = await createRefreshToken();
        
        await prisma.refreshToken.create({
            data: {
                refreshToken: refreshTokenHash,
                expiresAt,
                userId: user.id,
            }
        })
        setCookie(res, "authToken", FIFTEEN_MINS, authToken);
        setCookie(res, "refreshToken", THIRTY_DAYS, refreshToken);
        return res.status(200).json({ message: "Authentication Successful" });
    }
));

router.post('/refresh', asyncErrorWrapper(
    async (req, res) =>{
        const refreshTokenCookie = req.cookies.refreshToken;
        if(!refreshTokenCookie) throw new InvalidTokenError('Invalid Refresh Token');
        const oldRefreshTokenHash = hashToken(refreshTokenCookie);
        const refreshTokenRecord = await prisma.refreshToken.findUnique({
            where: { refreshToken: oldRefreshTokenHash }
        });
        if(!refreshTokenRecord) throw new InvalidTokenError('Invalid Refresh Token');
        const now = dayjs();
        const tokenExpiresAt = dayjs(refreshTokenRecord.expiresAt);
        if(now.isAfter(tokenExpiresAt)) throw new InvalidTokenError('Invalid Refresh Token');
        const authToken = createJWT(refreshTokenRecord.userId);
        const {refreshToken, refreshTokenHash, expiresAt} = await createRefreshToken();
        await prisma.$transaction([
            prisma.refreshToken.delete({
                where: {
                    refreshToken: oldRefreshTokenHash
                }
            }),
            prisma.refreshToken.create({
                data: {
                    refreshToken: refreshTokenHash,
                    expiresAt,
                    userId: refreshTokenRecord.userId,
                }
            })
        ]);
        setCookie(res, "authToken", FIFTEEN_MINS, authToken);
        setCookie(res, "refreshToken", THIRTY_DAYS, refreshToken);
        return res.status(200).json({ message: "Reauthentication Successful" });
    }
))

router.get('/user', optionalAuthMiddleware, asyncErrorWrapper(
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
                const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_HASH);
                const updatedUser = await prisma.user.update({
                    where: { id },
                    data: { password: hashedPassword }
                });
                return res.status(200).json({message: "Password Updated Successfully"});
            }
        }
    }
))

router.post('/logout', optionalAuthMiddleware, async (req, res) => {
    try {
        const authToken = req.cookies.authToken;
        const refreshToken = req.cookies.refreshToken;
        await prisma.refreshToken.delete({
            where: {
                refreshToken: hashToken(refreshToken)
            }
        });
        clearCookie(res, 'authToken', FIFTEEN_MINS);
        clearCookie(res, 'refreshToken', THIRTY_DAYS);
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
        
        const genericResponse = {message: "If your email is registered you will receive a mail shortly"}
        const user = await prisma.user.findUnique({ where: { email } });
        if(!user) return res.status(200).json(genericResponse);
        const token = await generateRandomToken();
        const tokenHash = hashToken(token);
        const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.user.update({
            where: {email},
            data: { resetPasswordToken: tokenHash, resetPasswordTokenExpiresAt: tokenExpiresAt }
        });

        const url = `${process.env.FRONTEND_URL}/resetPassword?token=${token}`;
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
        return res.status(200).json(genericResponse);
    }
));

router.post('/resetPassword', asyncErrorWrapper(
    async(req, res) => {
        const {password, token} = req.body; 
        const refreshToken = req.cookies.refreshToken;

        validateFields([
            {name: "New Password", value: password, type: 'text'},
            {name: "Token", value: token, type: 'text'},
        ]);

        const tokenHash = hashToken(token);
        const user = await prisma.user.findUnique({
            where: { resetPasswordToken: tokenHash }
        });
        if(!user) throw new InvalidTokenError('Invalid or Expired Token');
        const now = dayjs();
        const tokenExpiresAt = dayjs(user.resetPasswordTokenExpiresAt);

        if(now.isAfter(tokenExpiresAt)) throw new InvalidTokenError('Token has Expired');

        const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetPasswordToken: null, resetPasswordTokenExpiresAt: null }
        });
        await prisma.refreshToken.delete({
            where: {
                refreshToken: hashToken(refreshToken)
            }
        });
        clearCookie(res, 'authToken', FIFTEEN_MINS);
        clearCookie(res, 'refreshToken', THIRTY_DAYS);
        return res.status(200).json({message: 'Password Updated Successfully'});
    }
))

export default router;