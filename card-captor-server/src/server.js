import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import deckRoutes from './routes/deckRoutes.js';
import spacedRepRoutes from './routes/spacedRepRoutes.js';
import authMiddleware from '../src/middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5253;

app.use(cors({ 
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/flashcards', authMiddleware, flashcardRoutes);
app.use('/decks', authMiddleware, deckRoutes);
app.use('/spaced_repetition', authMiddleware, spacedRepRoutes);
app.use((req, res, next)=>{
    return res.status(404).json({error: "Endpoint Not Found"});
});
app.use(errorMiddleware);
app.listen(PORT, ()=>console.log(`Server Running on Port - ${PORT}`));