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
        const name = req.body.deckName;
        
        validateFields([
            {value: userId, name: "User ID", type: "id"},
            {value: name, name: "Deck Name", type: "text"}
        ]);

        const newDeck = await prisma.deck.create({
            data:{
                name,
                userId
            }
        });

        return res.status(201).json(newDeck);
    }
));

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

router.post('/editStatus', asyncErrorWrapper(
    async(req, res) =>{
        const decks = req.body.decks;
        const status = req.body.status;
        const userId = Number.parseInt(req.userId);
        
        validateFields([
            {value: userId, name: "User ID", type: "id"}, 
            {value: status, name: "Deck Status", type: "boolean"}, 
            {value: decks, name: "List of Decks", type: "array"}
        ]);

        decks.forEach(async deck=>{
            await prisma.deck.update({
                data: { isStudying: status },
                where: { id: deck, userId }
            })
        })
        return res.status(200).json({data: "All Good"});
    }
));

router.delete('/', asyncErrorWrapper(
    async (req, res)=>{
        let rawIds = req.query.ids;
        if(!rawIds) throw new MissingFieldError('Deck ID');
        if(typeof rawIds === 'string'){
            rawIds = [rawIds];
        }
        const userId = Number.parseInt(req.userId);
        const parsedIds = rawIds.map(id => Number.parseInt(id));
        validateFields([{value: userId, name: "User ID", type: "id"}]);

        const existingDecks = await prisma.deck.findMany({ where: {id: {in: parsedIds}, userId} });
        if(!existingDecks) throw new RecordNotFoundError(`Decks - ${parsedIds.join(', ')}`);

        await prisma.deck.deleteMany({
            where: {
                id: {in: parsedIds},
                userId,
            }
        })
        return res.status(200).json({message: "Deck Deleted Successfully"});
    }
));

export default router;