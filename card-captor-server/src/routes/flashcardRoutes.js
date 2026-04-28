import express from 'express';
import prisma from '../prismaClient.js';
import generateCards from '../services/ai.js';

const router = express.Router();

router.post('/generateCards', async(req, res)=>{
    try{
        const {text, questionTypes} = req.body;
        const deckId = parseInt(req.body.deckId);

        if(!text || !questionTypes || !deckId) return res.status(400).json({error: "Missing required fields"});

        const flashcards = await generateCards(text, questionTypes);

        if(!flashcards) return res.status(500).json({error: "Could not create flashcards. Please try again later."});

        const parsed = JSON.parse(flashcards);

        await prisma.flashcard.createManyAndReturn({
            data: parsed.map(flashcard=>({...flashcard, deckId}))
        });

        res.status(200).json({data: deckId});
    }catch(error){
        console.log(error);
        res.status(500).json({error: `Could not create flashcards. Please try again later. ${error.message}`});
    }
});

router.get('/:id', async(req, res)=>{
    try{
        const deckId = parseInt(req.params.id);
        const flashcards = await prisma.flashcard.findMany({
            where:{
                deckId
            }
        });
        return res.status(200).json({flashcards});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: `Could not find flashcards for deck. ${error.message}`});
    }
});


export default router;