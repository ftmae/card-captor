import express from 'express';
import asyncErrorWrapper from '../utils/asyncErrorWrapper.js';
import validateFields from '../utils/validation.js';
import prisma from '../prismaClient.js';
import { createEmptyCard, fsrs, Rating } from "ts-fsrs";
import { RecordNotFoundError } from '../custom-error-handling/DbError.js';

const router = express.Router();

router.get('/recall_types', asyncErrorWrapper(
    async(req, res) => {
        const recallTypeArray = [];
        for (const [key, value] of Object.entries(Rating)){
            if(key.length == 1 && key != '0') recallTypeArray.push({name: value, id: key});
        }
        return res.status(200).json({ratings: recallTypeArray});
    }
))

router.get('/', asyncErrorWrapper(
    async (req, res) => {
        let deckIds = req.query.deckId;
        if(typeof deckIds === 'string'){
            deckIds = [deckIds];
        }
        deckIds = deckIds.map(id => Number.parseInt(id));
        validateFields(deckIds.map(deckId=> ({value: deckId, type: 'id', name: "Deck ID"})));
        const flashcards = await prisma.flashcard.findMany({
            where:{
                deckId: {in: deckIds},
                fsrsData: {
                    path: ['due'],
                    lte: new Date()
                }
            }
        });
        return res.status(200).json({flashcards});
    }
));


router.put('/recall_type', asyncErrorWrapper(
    async (req, res) => {
        const rating = req.body.rating;
        const id = parseInt(req.body.id);

        validateFields([
            {type: 'id', value: id, name: "Flashcard ID"}, 
            {type: 'text', value: rating, name: "Answer Rating"}
        ]);

        const existingCard = await prisma.flashcard.findUnique({
            where:{id}
        });

        if(!existingCard) throw new RecordNotFoundError(`Flashcard - ${id}`);

        const scheduler = fsrs();
        const result = scheduler.next(existingCard.fsrsData, new Date(), Rating[rating]);
        await prisma.flashcard.update({
            where: { id },
            data: { fsrsData: result.card }
        });
        
        return res.status(200).json({message: "Update Successful"});
    }
));

export default router;