import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', async (req, res)=>{
    try{
        const decks = await prisma.deck.findMany({
            where: {
                userId: req.userId
            }
        });

        return res.status(200).json({decks});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

router.get('/create', async (req, res)=>{
    try{
        const decks = await prisma.deck.findMany({
            where: {
                userId: req.userId
            }
        });

        const newDeck = await prisma.deck.create({
            data:{
                name: `New Deck - ${decks.length+1}`,
                userId: req.userId
            }
        });

        return res.status(200).json(newDeck);
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

export default router;