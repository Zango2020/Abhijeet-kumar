import { GoogleGenAI, Type } from "@google/genai";
import type { Topic, GeneratedContent } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set. Please set GEMINI_API_KEY in your environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        explanation: {
            type: Type.STRING,
            description: "A comprehensive, clear, and well-structured explanation of the VoNR/5G topic. Use paragraphs, bullet points, and bold text for key terms. Include technical details while keeping it educational. Cover architecture, protocols, procedures, and practical implications. The tone should be professional and educational."
        },
        diagram: {
            type: Type.STRING,
            description: "A clean, modern, and informative SVG diagram that visually represents the core concepts of the VoNR/5G topic. For each key component or label (e.g., 'AMF', 'SMF', 'UPF', 'IMS', 'P-CSCF', 'gNB'), add attributes to the relevant SVG element or group (`<g>`). These attributes are: `data-tooltip-content` containing a brief, one-sentence explanation; `aria-label` with the same explanation; `role='button'`; `tabindex='0'`; and `style='cursor: pointer'`. For example: `<g data-tooltip-content='The Access and Mobility Management Function handles registration, connection, and mobility.' aria-label='AMF handles registration, connection, and mobility.' role='button' tabindex='0' style='cursor: pointer'>...</g>`. The SVG must be self-contained, responsive with a viewBox, and use clear labels. Use a color palette of #06b6d4 (cyan-500), #a855f7 (purple-500), #f0f9ff (sky-50), #0891b2 (cyan-600), #67e8f9 (cyan-300), #c084fc (purple-400) and #a5f3fc (cyan-200) for fills, strokes, and text colors. The SVG background should be transparent. Do not include any XML declaration. The root <svg> tag should be the only top-level element. Use animations where appropriate with <animate> tags for signal flows or data paths."
        }
    },
    required: ["explanation", "diagram"]
};

export const generateVoNRExplanation = async (topic: Topic, moduleTitle: string): Promise<GeneratedContent> => {
    const prompt = `
You are an expert telecommunications engineer specializing in 5G NR, VoNR (Voice over New Radio), and IMS technologies. Your task is to generate educational content for a professional VoNR training course.

For the given topic: "${topic.title}" from the module "${moduleTitle}", please provide:

1. A detailed, comprehensive explanation covering:
   - Core concepts and definitions
   - Technical architecture and components
   - Protocols and interfaces involved
   - Practical implementation considerations
   - Industry best practices
   - Comparison with previous technologies (VoLTE/4G) where relevant

2. An interactive SVG diagram that:
   - Illustrates the key architecture/flow/concept
   - Uses modern, professional styling with cyan/purple color scheme
   - Has interactive tooltips on major components
   - Shows data/signal flows with arrows
   - Is clear and educational

Return the output as a single JSON object with "explanation" and "diagram" fields.
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
        throw new Error("Failed to fetch data from the Gemini API. Please check your API key and network connection.");
    }
};
