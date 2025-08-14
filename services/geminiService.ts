
import { GoogleGenAI, Type } from "@google/genai";
import type { Topic, GeneratedContent } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        explanation: {
            type: Type.STRING,
            description: "A comprehensive, clear, and well-structured explanation of the topic. Use paragraphs, bullet points, and bold text for key terms to improve readability. The tone should be professional and educational."
        },
        diagram: {
            type: Type.STRING,
            description: "A clean, modern, and informative SVG diagram that visually represents the core concepts of the topic. The SVG must be self-contained, responsive with a viewBox, and use clear labels and a logical flow. Use a color palette of #06b6d4 (cyan-500), #f0f9ff (sky-50), #0891b2 (cyan-600), #67e8f9 (cyan-300) and #a5f3fc (cyan-200) for fills, strokes, and text colors. The SVG background should be transparent. Do not include any XML declaration (<?xml ... ?>). The root <svg> tag should be the only top-level element."
        }
    },
    required: ["explanation", "diagram"]
};

export const generateLteExplanation = async (topic: Topic, moduleTitle: string): Promise<GeneratedContent> => {
    const prompt = `
You are an expert telecommunications engineer specializing in LTE and 5G technologies. Your task is to generate educational content for a training course.

For the given topic: "${topic.title}" from the module "${moduleTitle}", please provide a detailed explanation and a corresponding SVG diagram.

Return the output as a single JSON object that strictly follows this schema:
{
  "explanation": "string",
  "diagram": "string"
}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedContent: GeneratedContent = JSON.parse(jsonText);
        
        // Basic validation
        if (typeof parsedContent.explanation !== 'string' || typeof parsedContent.diagram !== 'string') {
            throw new Error("Invalid JSON structure received from API.");
        }

        return parsedContent;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to fetch data from the Gemini API.");
    }
};
