import React from "react";
import GameGrid from "./GameGrid";
import { useEffect, useRef } from "react";
import { useState } from "react";

const Board = () => {
  const [word, setWord] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const hasFetched = useRef(false);

  const fetchWord = async () => {
    try {
      const response = await fetch("./src/assets/word_list.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const selectedWord = result.words[Math.floor(Math.random() * result.words.length)];
      console.log('Selected word:', selectedWord);
      setWord(selectedWord);
    } catch (error) {
      console.error('Error fetching word list:', error);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchWord();
  }, []);

  const evaluateGuess = (guessWord, targetWord) => {
    const evaluation = [];
    const targetLetters = targetWord.toUpperCase().split('');
    const guessLetters = guessWord.toUpperCase().split('');
    const usedIndices = new Set();

    for (let i = 0; i < guessLetters.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        evaluation[i] = 'correct';
        usedIndices.add(i);
      }
    }

    for (let i = 0; i < guessLetters.length; i++) {
      if (evaluation[i] === 'correct') continue;
      
      for (let j = 0; j < targetLetters.length; j++) {
        if (!usedIndices.has(j) && guessLetters[i] === targetLetters[j]) {
          evaluation[i] = 'present';
          usedIndices.add(j);
          break;
        }
      }
      
      if (!evaluation[i]) {
        evaluation[i] = 'absent';
      }
    }

    return evaluation;
  };

  const handleGuessSubmit = (guessWord) => {
    if (!word || guesses.length >= 6 || hasWon || hasLost) return;
    
    const evaluation = evaluateGuess(guessWord, word);
    const newGuess = {
      word: guessWord.toUpperCase(),
      evaluation: evaluation
    };
    
    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);
    
    if (evaluation.every(status => status === 'correct')) {
      setHasWon(true);
    } else if (updatedGuesses.length >= 6) {
      setHasLost(true);
    }
  };

  const handleRestart = () => {
    setGuesses([]);
    setHasWon(false);
    setHasLost(false);
    hasFetched.current = false;
    fetchWord();
  };

  return (
    <>
      <GameGrid word={word} guesses={guesses} onGuessSubmit={handleGuessSubmit} hasWon={hasWon} hasLost={hasLost} />
      {hasWon && (
        <div className="win-popup-overlay">
          <div className="win-popup">
            <h2>🎉 You Won!</h2>
            <p>Congratulations! You guessed the word correctly.</p>
            <button className="restart-button" onClick={handleRestart}>
              Play Again
            </button>
          </div>
        </div>
      )}
      {hasLost && (
        <div className="win-popup-overlay">
          <div className="lose-popup">
            <h2>😔 You Lost!</h2>
            <p>The word was: <strong>{word?.toUpperCase()}</strong></p>
            <button className="restart-button lose-restart-button" onClick={handleRestart}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
