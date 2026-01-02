
import { GoogleGenAI, Type } from "@google/genai";
import { GenerateRequest, InputMode, SummaryResult } from "../types";

// Always use the recommended model for basic text tasks
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The title of the book" },
    author: { type: Type.STRING, description: "The author of the book" },
    summary: { type: Type.STRING, description: "A cohesive summary text" },
    keyTakeaways: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3-5 key bullet points"
    },
    readingTimeSaved: { type: Type.STRING, description: "Estimated time saved (e.g., '4 hours')" }
  },
  required: ["title", "author", "summary", "keyTakeaways", "readingTimeSaved"]
};

export const generateSummary = async (request: GenerateRequest): Promise<SummaryResult> => {
  let prompt = "";

  if (request.mode === InputMode.PASTE) {
    prompt = `Summarize the following text as if it were a book. 
    Target Length: ${request.length}.
    Text: ${request.text}`;
  } else {
    const d = request.details!;
    prompt = `Generate a book summary based on these details.
    Title: ${d.title}
    Author: ${d.author}
    Genre: ${d.genre}
    Key Concepts to Focus On: ${d.concepts}
    Target Length: ${request.length}.
    
    If the book is real and famous, use your internal knowledge to enhance the summary accuracy.
    If it seems fictional or user-generated, stick strictly to the provided concepts.`;
  }

  try {
    // Calling generateContent with the specified model and configuration
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert literary summarizer. Your goal is to help users retain knowledge and save time. Provide output in strict JSON format.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);
    
    return {
      ...parsed,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
