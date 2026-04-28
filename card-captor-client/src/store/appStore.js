import { create } from 'zustand';

const useAppStore = create((set)=>({
        text: null, 
        setText: (text) => set(prev=> ({text})),
        pages: {from: 1, to: 1},
        setPages: (key, value) => set(prev=>({pages: {...prev.pages, [key]: value}})),
        incrementPages: (key) => set(prev=>({pages: {...prev.pages, [key]: prev.pages[key] + 1}})),
        decrementPages: (key) => set(prev=>({pages: {...prev.pages, [key]: prev.pages[key] - 1}})),
        resetPages: ()=> set(({pages: {from: 1, to: 1}})),
        flashcards: null,
        setFlashcards: (flashcards)=>set(({flashcards}))
    }));

export default useAppStore;