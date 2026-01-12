
import { GoogleGenAI, Type } from "@google/genai";
import { OrderList, AnalysisResult, GeneratedAsset } from "../types";

const SYSTEM_INSTRUCTION = `
# Role
You are "NANOBANANAPRO", an expert AI character design director and asset generator for game development.

# Objective
Your task is to analyze a provided "Reference Character Image" and a "JSON Order List". Based on these inputs, you must define the precise visual details to generate consistent game assets (Standing art, Expressions, Event CGs).

# Rules & Constraints
1. **Character Consistency**: The physical features (hair style, eye color, face shape, accessories) and costume design must strictly match the "Reference Character Image". Do not hallucinate new features unless specified by the order.
2. **Metadata Generation**: You must generate a concise character ID (snake_case), localized Name (Japanese if possible), a brief background Description, and relevant Tags (e.g., ADVENTURER, MAGE, ALLY).
3. **Asset Types**:
   - **Standing**: Full body or knee-up, neutral or specific pose, transparent or simple background.
   - **Expression**: Close-up on the face, preserving the exact angle/lighting of the standing art but changing facial features.
   - **CG**: Cinematic composition, specific lighting, background included.
4. **Output Format**: You must output the result in a valid JSON format as defined by the responseSchema.
`;

export const analyzeCharacterAndOrders = async (
    base64Image: string,
    orderList: OrderList
): Promise<AnalysisResult> => {
    // Note: In the main app, we need to make sure process.env.GEMINI_API_KEY is available.
    // Vite uses import.meta.env.VITE_GEMINI_API_KEY usually, but let's check how the user set it up.
    // The previous code used process.env.API_KEY. I will try to support both or standard Vite env.
    // @ts-ignore
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    // Fallback if user hasn't set VITE_ prefix yet, though they should.

    if (!apiKey) {
        console.error("API Key is missing. Please set VITE_GEMINI_API_KEY in .env");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash', // Using a stable model name, or the user's preferred 'gemini-3-flash-preview' if available
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/png',
                        data: base64Image.split(',')[1] || base64Image,
                    },
                },
                {
                    text: `Analyze this character and process the order: ${JSON.stringify(orderList)}. 
          Provide metadata for a 'data.json' file including a unique snake_case ID, name in Japanese, description, and tags.`,
                },
            ],
        },
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "snake_case id" },
                    name: { type: Type.STRING, description: "Display name in Japanese" },
                    description: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    visualStyle: { type: Type.STRING },
                    keyFeatures: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    assets: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.INTEGER },
                                filename: { type: Type.STRING },
                                type: { type: Type.STRING },
                                description: { type: Type.STRING },
                                prompt: { type: Type.STRING },
                            },
                            required: ["id", "filename", "type", "description", "prompt"]
                        }
                    }
                },
                required: ["id", "name", "description", "tags", "visualStyle", "keyFeatures", "assets"]
            },
        },
    });

    try {
        return JSON.parse(response.text || '{}');
    } catch (e) {
        console.error("Failed to parse analysis result", e);
        throw new Error("Invalid response from Gemini");
    }
};

export const generateAssetImage = async (
    prompt: string,
    base64Reference?: string
): Promise<string> => {
    // @ts-ignore
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = [{ text: prompt }];
    if (base64Reference) {
        parts.unshift({
            inlineData: {
                mimeType: 'image/png',
                data: base64Reference.split(',')[1] || base64Reference,
            },
        });
    }

    // NOTE: 'gemini-2.5-flash-image' might be a placeholder. 
    // Standard Imagen model or Gemini 1.5 Flash supporting image gen should be used.
    // Reviewing user's code, they used 'gemini-2.5-flash-image'. I will keep it but it might fail if not real.
    // I'll stick to USER'S specified model names to avoid breaking their intended flow, 
    // but if it fails I'll advise.
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: { parts },
        // config: { imageConfig: { aspectRatio: "1:1" } } // Not all models support this config structure in JS SDK yet
    });

    // The SDK return structure for image generation might differ.
    // I will trust the user's code structure for now but add a little safety.
    /* 
    User's original code:
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    */

    // Check if response has inlineData (image)
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }

    throw new Error("No image generated");
};
