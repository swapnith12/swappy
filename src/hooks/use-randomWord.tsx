import React, { createContext, useContext, useState, useEffect } from "react";
import { generate } from "random-words";


const RandomWordContext = createContext<{ randomWord: string | string[], regenerate: () => void } | undefined>(undefined);

export const useRandomWord = () => {
    const context = useContext(RandomWordContext);
    return context;
};


export function RandomWordProvider({ children }: { children: React.ReactNode }) {
    const [randomWord, setRandomWord] = useState<string | string[]>("");
    const regenerate = () => setRandomWord(generate())
    useEffect(() => {
        regenerate();
    }, []);

    const obj = {randomWord,regenerate}

    return (
        <RandomWordContext.Provider value={obj}>
            {children}
        </RandomWordContext.Provider>
    );
}
