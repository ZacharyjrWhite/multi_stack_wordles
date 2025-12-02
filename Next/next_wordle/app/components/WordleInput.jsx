"use client"; 
import { useRef, useEffect, useState } from 'react';

const WordleInput = ({ word, guesses, onGuessSubmit, hasWon, hasLost }) => {
    const [inputWord, setInputWord] = useState('');
    const inputRef = useRef(null);
    
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    });
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputWord.trim() !== '') {
            if (!word || inputWord.length !== 5 || guesses.length >= 6 || hasWon || hasLost) {
                return;
            }

            onGuessSubmit(inputWord);
            setInputWord('');
        }
    };
    
    const handleBlur = () => {
        //Used to keep the input focused when the user clicks outside of it
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };
    
    return (
        <input 
            ref={inputRef}
            className="wordle-input" 
            type="text" 
            placeholder="Enter a 5 letter word" 
            value={inputWord || ''} 
            onChange={(e) => {
                if (hasWon || hasLost) return;
                const value = e.target.value.toUpperCase().slice(0, 5);
                setInputWord(value);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={hasWon || hasLost}
            autoFocus
        />
    );
};

export default WordleInput;