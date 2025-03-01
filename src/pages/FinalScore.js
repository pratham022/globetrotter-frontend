import React from "react";
import "../styles/FinalScore.css";

function FinalScore({ score, onRestart }) {
    return (
        <div className="final-score-container">
            <h2>Game Over!</h2>
            <p className="final-score">Your Final Score: {score} / 5</p>
            <button className="restart-button" onClick={onRestart}>
                Take the Quiz Again
            </button>
        </div>
    );
}

export default FinalScore;
