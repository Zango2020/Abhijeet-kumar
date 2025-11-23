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
            description: "A comprehensive, detailed, and engaging explanation of the 5G security topic. Write as if you are a world-class cybersecurity instructor explaining to students. Use paragraphs, bullet points, and bold text for key terms. Include: 1) Introduction/overview, 2) Core concepts with real-world examples, 3) Security implications and risks, 4) Best practices and countermeasures, 5) Industry relevance. The tone should be professional yet accessible, educational, and inspiring. Aim for 300-500 words."
        },
        diagram: {
            type: Type.STRING,
            description: `Create a stunning, modern, and highly informative SVG diagram that visually represents the 5G security concepts. The diagram should be professional-grade and suitable for enterprise training.

DESIGN REQUIREMENTS:
1. Use a dark theme with the color palette: #06b6d4 (cyan-500), #22d3ee (cyan-400), #67e8f9 (cyan-300), #0891b2 (cyan-600), #0e7490 (cyan-700), #164e63 (cyan-900), #083344 (dark bg)
2. Add subtle gradients for depth and dimension
3. Include drop shadows and glow effects for key elements
4. Use rounded corners and modern styling
5. Add icons or symbols relevant to security (locks, shields, keys, networks)

INTERACTIVITY REQUIREMENTS:
For each key component, add these attributes to the relevant SVG element or group (<g>):
- data-tooltip-content="Brief explanation of this component"
- aria-label="Same explanation for accessibility"
- role="button"
- tabindex="0"
- cursor="pointer"

Example: <g data-tooltip-content="The 5G-AKA protocol provides mutual authentication between UE and network." aria-label="..." role="button" tabindex="0" style="cursor:pointer">...</g>

LAYOUT:
- Use viewBox="0 0 800 500" for optimal aspect ratio
- Include a title/header for the diagram
- Use clear labels with good typography (font-family: system-ui, sans-serif)
- Create logical visual flow (top-to-bottom or left-to-right)
- Group related elements together
- Add connecting lines/arrows to show relationships
- Include a small legend if needed

ANIMATION HINTS (CSS classes to add):
- Add class="animate-pulse-glow" to security elements
- Add class="animate-float" to floating elements
- Add class="animate-node-pulse" to network nodes

The SVG must be self-contained, responsive, and NOT include any XML declaration. The root <svg> tag should be the only top-level element.`
        }
    },
    required: ["explanation", "diagram"]
};

export const generate5GSecurityExplanation = async (topic: Topic, moduleTitle: string): Promise<GeneratedContent> => {
    const prompt = `
You are a world-renowned 5G security expert and instructor with 20+ years of experience in telecommunications security, currently teaching at top institutions and consulting for major telecom operators worldwide.

Your mission is to create exceptional educational content for the "5G Security Masterclass" - a professional certification course.

TOPIC: "${topic.title}"
MODULE: "${moduleTitle}"

Please provide:
1. A comprehensive, engaging explanation that would make students excited about 5G security
2. A professional-grade SVG diagram that visualizes the key concepts

The content should:
- Be technically accurate and up-to-date with 3GPP Release 16/17 standards
- Include practical, real-world examples and scenarios
- Highlight security threats, vulnerabilities, and countermeasures
- Reference relevant protocols, interfaces, and network functions
- Be suitable for professionals seeking 5G security certification

Return the output as a single JSON object:
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
                temperature: 0.7,
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

// Alias for backward compatibility
export const generateLteExplanation = generate5GSecurityExplanation;
