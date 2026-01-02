
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const fetchThematicWords = async (level: number): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of 20 medieval, fantasy, or archery-themed words. 
                 The difficulty should be appropriate for level ${level} (higher levels mean longer/complex words). 
                 Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const words = JSON.parse(response.text);
    return Array.isArray(words) ? words : getDefaultWords(level);
  } catch (error) {
    console.error("Error fetching words from Gemini:", error);
    return getDefaultWords(level);
  }
};

const getDefaultWords = (level: number): string[] => {
  const basic = ["arrow", "bow", "target", "quiver", "aim", "shoot", "wood", "string", "forest", "hunt"];
  const advanced = ["ballista", "broadhead", "recurve", "longbow", "fletching", "marksman", "precision", "trajectory", "medieval", "fortress"];
  return level > 5 ? [...basic, ...advanced] : basic;
};
