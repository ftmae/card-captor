import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import deckRoutes from './routes/deckRoutes.js';
import authMiddleware from '../src/middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5253;

app.use(cors({ 
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/flashcards', authMiddleware, flashcardRoutes);
app.use('/decks', authMiddleware, deckRoutes);

app.listen(PORT, ()=>console.log(`Server Running on Port - ${PORT}`));