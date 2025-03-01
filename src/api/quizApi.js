import axios from "axios";
import { PROD_BASE_URL } from "../constants";

export const fetchQuizQuestion = async () => {
    try {
        const response = await fetch(`${PROD_BASE_URL}/api/destinations/quiz`);
        if (!response.ok) throw new Error("Failed to fetch");
        return await response.json();
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return null; // Prevents crashing
    }
};

export const submitAnswer = async (questionId, selectedAnswer) => {
    const response = await axios.post(`${PROD_BASE_URL}/api/destinations/quiz/validate`, {
        questionId,
        selectedAnswer
    });
    return response.data;
};
