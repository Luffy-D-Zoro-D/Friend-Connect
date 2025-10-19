import { GoogleGenAI } from "@google/genai";

// As per guidelines, the API key is assumed to be in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getStatusSuggestion = async (previousStatuses: string[]): Promise<string> => {
  try {
    const prompt = `Based on these recent activities: "${previousStatuses.join(', ')}".
    Suggest a short, creative, and fun status update (2-5 words long, do not use emojis).
    Examples: 'Conquering virtual worlds', 'Brewing the perfect coffee', 'Deep in thought', 'Crafting some code', 'Chasing deadlines'.
    The suggestion should be a new activity, not a variation of the last one. Just return the text of the suggestion, nothing else.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Clean up quotes and trim whitespace
    const suggestion = response.text.trim().replace(/["']/g, "");
    return suggestion || "Thinking of something new...";

  } catch (error) {
    console.error("Error fetching Gemini suggestion:", error);
    throw new Error("Failed to generate suggestion from Gemini API.");
  }
};
