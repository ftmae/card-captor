import express from 'express';
import prisma from '../prismaClient.js';
import { Prisma } from '../../generated/prisma/client.ts';
import asyncErrorWrapper from '../utils/asyncErrorWrapper.js';
import validateFields from '../utils/validation.js';
import { InvalidFieldError, MissingFieldError } from '../custom-error-handling/ValidationError.js';
import { RecordNotFoundError } from '../custom-error-handling/DbError.js';

const router = express.Router();

router.get('/', asyncErrorWrapper(
    async (req, res)=>{
        const userId = Number.parseInt(req.userId);
        validateFields([{value: userId, name: "User ID", type: "id"}]);
        
        const decks = await prisma.deck.findMany({
            where: { userId }
        });
        return res.status(200).json({decks});
    }
));

router.post('/create', asyncErrorWrapper(
    async (req, res)=>{
        const userId = Number.parseInt(req.userId);
        validateFields([{value: userId, name: "User ID", type: "id"}]);

        const decks = await prisma.deck.findMany({
            where: { userId }
        });

        const newDeck = await prisma.deck.create({
            data:{
                name: `New Deck - ${decks.length+1}`,
                userId
            }
        });

        return res.status(201).json(newDeck);
    }
));

// router.post('/duplicate/:id', asyncErrorWrapper(
//     async(req, res)=>{
//         const deckId = Number.parseInt(req.params.id);
//         const name = req.body.name;
//         const userId = Number.parseInt(req.userId);
//         validateFields([
//             {value: deckId, name: "Deck ID", type: "id"}, 
//             {value: name, name: "Deck Name", type: "text"},
//             {value: userId, name: "User ID", type: "id"}
//         ]);
//         // first fetch all records from existing deck ID 
//         const flashcards = await prisma.flashcard.findMany({ where: { deckId }});
//         const newDeck = await prisma.deck.create({
//             data:{
//                 name: name + "- Duplicate",
//                 userId
//             }
//         });
//         console.log(newDeck.id);
//         await prisma.flashcard.createManyAndReturn({
//             data: flashcards.map(flashcard=>({...flashcard, deckId: newDeck.id}))
//         });        
//         console.log(newDeck);
//         return res.status(200).json({message: "Deck Duplicated Successfully"});
//     }
// ));

router.put('/:id', asyncErrorWrapper(
    async (req, res)=>{
        const id = Number.parseInt(req.params.id);
        const userId = Number.parseInt(req.userId);
        const name = req.body.updatedName;
        validateFields([{value: userId, name: "User ID", type: "id"}, {value: id, name: "Deck ID", type: "id"}, {value: name, name: "Deck Name", type: "text"}]);
        
        const deck = await prisma.deck.findFirst({ where: {id, userId} });
        if(!deck) throw new RecordNotFoundError(`Deck - ${id}`);

        const updatedDeck = await prisma.deck.update({
            data:{ name },
            where:{
                id, userId,
            }
        });

        return res.status(200).json({data: updatedDeck});
    }
))

router.delete('/:id', asyncErrorWrapper(
    async (req, res)=>{
        const id = Number.parseInt(req.params.id);
        const userId = Number.parseInt(req.userId);

        validateFields([{value: userId, name: "User ID", type: "id"}, {value: id, name: "Deck ID", type: "id"}]);

        const deck = await prisma.deck.findFirst({ where: {id, userId} });
        if(!deck) throw new RecordNotFoundError(`Deck - ${id}`);
        await prisma.deck.delete({
            where:{
                id,
                userId,
            }
        });
        return res.status(200).json({message: "Deck Deleted Successfully"});
    }
));

export default router;