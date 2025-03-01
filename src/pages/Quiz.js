import { useState, useEffect } from "react";
import { fetchQuizQuestion, submitAnswer } from "../api/quizApi";
import "../styles/Quiz.css";
import FinalScore from "./FinalScore";

function Quiz() {
    const [questionData, setQuestionData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleClues, setVisibleClues] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    useEffect(() => {
        if (questionIndex < 5) {
            loadQuestion();
        }
    }, [questionIndex]);

    async function loadQuestion() {
        if (questionIndex >= 5) return;

        setLoading(true);
        try {
            const data = await fetchQuizQuestion();
            setQuestionData(data);
            setResult(null);
            setSelectedOption(null);
            setVisibleClues(1);
            setSubmitted(false);
        } catch (error) {
            console.error("Error loading question:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleShowAnotherClue = () => {
        if (visibleClues < questionData.clues.length) {
            setVisibleClues(visibleClues + 1);
        }
    };

    const handleSubmit = async () => {
        if (!selectedOption || submitted) return;
        setSubmitted(true);

        try {
            const response = await submitAnswer(questionData.questionId, selectedOption.city);
            setResult(response);

            if (response.correct) {
                setScore((prevScore) => prevScore + 1);
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };

    const handleNextQuestion = () => {
        if (questionIndex < 4) {
            setQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            // This is the last question, show final score
            setQuizCompleted(true);
        }
    };

    const handleFinishQuiz = async () => {
        setQuizCompleted(true);

        const username = localStorage.getItem("username");
        if (username) {
            try {
                const response = await fetch("http://localhost:5000/api/users/update-score", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: username, score: score })
                });

                const data = await response.json();
                console.log("Guest score updated:", data);
                
                localStorage.removeItem("guestScore"); // Remove score after updating
            } catch (error) {
                console.error("Error updating guest score:", error);
            }
        } else {
            localStorage.setItem("guestScore", score);
        }

    };

    const handleRestart = () => {
        setQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
    };

    if (quizCompleted) {
        return <FinalScore score={score} onRestart={handleRestart} />;
    }

    if (loading) return <p className="loading-text">Loading quiz...</p>;
    if (!questionData) return <p className="error-text">No question available</p>;

    const isLastQuestion = questionIndex === 4;

    return (
        <div className="quiz-container">
            <h2>Guess the Destination ({questionIndex + 1}/5)</h2>

            <p><strong>Clues:</strong></p>
            <ul className="clue-list">
                {questionData.clues.slice(0, visibleClues).map((clue, index) => (
                    <li key={index} className="clue-item">{clue}</li>
                ))}
            </ul>

            {visibleClues < questionData.clues.length && (
                <button className="clue-button" onClick={handleShowAnotherClue} disabled={submitted}>
                    Show Another Clue
                </button>
            )}

            <div className="options">
                {questionData.choices.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => !submitted && setSelectedOption(choice)}
                        className={`option-button ${selectedOption === choice ? "selected" : ""}`}
                        disabled={submitted}
                    >
                        {choice.city}, {choice.country}
                    </button>
                ))}
            </div>

            <div className="button-container">
                <button className="submit-button" onClick={handleSubmit} disabled={!selectedOption || submitted}>
                    Submit Answer
                </button>
                
                {isLastQuestion ? (
                    <button 
                        className="finish-button" 
                        onClick={handleFinishQuiz} 
                        disabled={!submitted}
                    >
                        See Final Results
                    </button>
                ) : (
                    <button 
                        className="next-button" 
                        onClick={handleNextQuestion} 
                        disabled={!submitted}
                    >
                        Next Question
                    </button>
                )}
            </div>

            {result && (
                <div className="result">
                    <p className={`result-text ${result.correct ? "correct" : "wrong"}`}>
                        {result.correct ? "🎉 Correct!" : "❌ Wrong Answer!"}
                    </p>
                    {!result.correct && (
                        <p><strong>Correct Answer:</strong> {result.correctAnswer}, {result.correctAnswerCountry}</p>
                    )}
                    <div className="info-section">
                        <h3>Fun Facts</h3>
                        <ul className="info-list">
                            {result.funFacts.map((fact, index) => (
                                <li key={index}>{fact}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="info-section">
                        <h3>Trivia</h3>
                        <ul className="info-list">
                            {result.trivia.map((trivia, index) => (
                                <li key={index}>{trivia}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Quiz;