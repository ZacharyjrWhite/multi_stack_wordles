import React from 'react';
import WordleInput from './WordleInput';

const GameGrid = ({ word, guesses, onGuessSubmit, hasWon, hasLost }) => {
    const rows = 6;
    const cols = 5;

    const renderCell = (rowIndex, colIndex) => {
        const guess = guesses[rowIndex];
        
        if (guess && guess.word[colIndex]) {
            const letter = guess.word[colIndex];
            const evaluation = guess.evaluation[colIndex];
            return (
                <div className={`cell ${evaluation}`} key={`${rowIndex}-${colIndex}`}>
                    {letter}
                </div>
            );
        }
        
        return (
            <div className="cell" key={`${rowIndex}-${colIndex}`}></div>
        );
    };

    const renderGrid = () => {
        const cells = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                cells.push(renderCell(row, col));
            }
        }
        return cells;
    };

    return (
        <div className="grid" id="grid">
            {renderGrid()}
            <WordleInput word={word} guesses={guesses} onGuessSubmit={onGuessSubmit} hasWon={hasWon} hasLost={hasLost} />
        </div>
    );
};

export default GameGrid;