import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const fetchQuizQuestion = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/destinations/quiz`);
        if (!response.ok) throw new Error("Failed to fetch");
        return await response.json();
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return null; // Prevents crashing
    }
};

export const submitAnswer = async (questionId, selectedAnswer) => {
    const response = await axios.post(`${API_BASE_URL}/api/destinations/quiz/validate`, {
        questionId,
        selectedAnswer
    });
    return response.data;
};
