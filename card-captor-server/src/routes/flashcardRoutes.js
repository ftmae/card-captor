import express from 'express';
import prisma from '../prismaClient.js';
import generateCards from '../services/ai.js';
import asyncErrorWrapper from '../utils/asyncErrorWrapper.js';
import validateFields from '../utils/validation.js';
import { RecordNotFoundError } from '../custom-error-handling/DbError.js';
import { createEmptyCard } from 'ts-fsrs';
import { MissingFieldError } from '../custom-error-handling/ValidationError.js';

const router = express.Router();

router.post('/generateCards', asyncErrorWrapper(
    async(req, res)=>{
        const {text, questionTypes} = req.body;
        const deckId = parseInt(req.body.deckId);

        validateFields([
            {value: deckId, name: "Deck ID", type: "id"}, 
            {value: text, name: "Input Text", type: "text"},
            {value: questionTypes, name: "Question Types", type: 'array'}
        ]);
        
        const deck = await prisma.deck.findFirst({ where: {id: deckId} });
        if(!deck) throw new RecordNotFoundError(`Deck - ${deckId}`);
        
        const flashcards = await generateCards(text, questionTypes);

        if(!flashcards) return res.status(500).json({error: "Could not create flashcards. Please try again later."});

        const parsed = JSON.parse(flashcards);

        await prisma.flashcard.createMany({
            data: parsed.map(flashcard=>({...flashcard, deckId, fsrsData: createEmptyCard()}))
        });

        res.status(200).json({data: deckId});
    }
));

router.get('/', asyncErrorWrapper(
    async(req, res)=>{
        let deckIds = req.query.deckId;
        if(typeof deckIds === 'string'){
            deckIds = [deckIds];
        }
        deckIds = deckIds.map(deckId => Number.parseInt(deckId));

        let flashcards = [];
        for (const deckId of deckIds){
            validateFields([{value: deckId, name: "Deck ID", type: "id"}]);
            const deck = await prisma.deck.findFirst({ where: {id: deckId} });
            if(!deck) throw new RecordNotFoundError(`Deck - ${deckId}`);
            const deckFlashcards = await prisma.flashcard.findMany({
                where:{ deckId }
            });
            flashcards.push(...deckFlashcards);
        }
        return res.status(200).json({flashcards});
    }
));

router.post('/create', asyncErrorWrapper(
    async (req, res)=>{
        const {question, answer, type} = req.body;
        const deckId = parseInt(req.body.deckId);
        
        validateFields([
            {value: deckId, name: "Deck ID", type: "id"}, 
            {value: question, name: "Question", type: "text"},
            {value: answer, name: "Answer", type: "text"},
            {value: type, name: "Flashcard Type", type: "text"},
        ]);

        const deck = await prisma.deck.findFirst({ where: {id: deckId} });
        if(!deck) throw new RecordNotFoundError(`Deck - ${deckId}`);

        const flashcard = await prisma.flashcard.create({
            data: { deckId, question, answer, type, fsrsData: createEmptyCard()}
        });
        return res.status(201).json({flashcard});
    }
))

router.delete('/', asyncErrorWrapper(
    async (req, res)=>{
        let rawIds = req.query.ids;
        if(!rawIds) throw new MissingFieldError('Flashcard ID');
        if(typeof rawIds === 'string') rawIds = [rawIds];
        const parsedIds = rawIds.map(id => Number.parseInt(id));
        await prisma.flashcard.deleteMany({
            where: { 
                id: {in: parsedIds}
             }
        });
        return res.status(200).json({data: "Flashcard Deleted Successfully"});
    }
));


router.put('/:id', asyncErrorWrapper(
    async (req, res)=>{
        const id = parseInt(req.params.id);
        const deckId = parseInt(req.body.deckId);
        const {question, answer, type} = req.body;

        validateFields([
            {value: id, name: "Flashcard ID", type: "id"}, 
            {value: deckId, name: "Deck ID", type: "id"}, 
            {value: question, name: "Question", type: "text"},
            {value: answer, name: "Answer", type: "text"},
            {value: type, name: "Flashcard Type", type: "text"},
        ]);

        const deck = await prisma.deck.findFirst({ where: {id: deckId} });
        if(!deck) throw new RecordNotFoundError(`Deck - ${deckId}`);
        
        const updatedCard = await prisma.flashcard.update({
            data:{
                question, answer, type, deckId
            },
            where:{
                id, deckId
            }
        });
        return res.status(200).json({data: updatedCard});
    }
));


export default router;