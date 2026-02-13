import { GoogleGenAI } from "@google/genai";
import { GenerationSettings, ModelType } from "../types";

// Helper to check for API key selection for Pro models (only relevant in AI Studio environment)
const ensureApiKeySelected = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const aiStudio = (window as any).aistudio;
    if (aiStudio.hasSelectedApiKey && aiStudio.openSelectKey) {
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey) {
        await aiStudio.openSelectKey();
        return await aiStudio.hasSelectedApiKey();
      }
      return true;
    }
  }
  return true; 
};

export const generateImage = async (
  rawPrompt: string,
  settings: GenerationSettings
): Promise<string> => {
  try {
    // 1. Vercel Deployment Check: If no local key exists, use the server-side proxy
    // This is the standard "Vercel Backend" adjustment.
    if (!process.env.API_KEY) {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: rawPrompt, settings })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server Error: ${response.status}`);
      }

      const data = await response.json();
      return data.imageUrl;
    }

    // 2. Direct SDK fallback (for AI Studio development environment)
    if (settings.model === ModelType.PRO) {
      const authorized = await ensureApiKeySelected();
      if (!authorized) throw new Error("API Key selection required for Pro model.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let fullPrompt = `Generate an image based on the following instructions.\n`;
    fullPrompt += `Style Guideline: Default to photorealistic, cinematic photography unless the prompt explicitly requests a different style.\n`;

    if (settings.category) fullPrompt += `Genre: ${settings.category}.\n`;
    if (settings.theme) fullPrompt += `Theme: ${settings.theme}.\n`;
    if (settings.globalColorPalette) fullPrompt += `Color: ${settings.globalColorPalette}.\n`;
    fullPrompt += `\nSubject: ${rawPrompt}`;

    const response = await ai.models.generateContent({
      model: settings.model,
      contents: { parts: [{ text: fullPrompt }] },
      config: {
        imageConfig: {
          aspectRatio: settings.aspectRatio === '21:9' ? '16:9' : settings.aspectRatio as any,
        },
      },
    });

    let base64Image = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

    if (!base64Image) {
      throw new Error("No image returned from direct SDK call.");
    }

    return `data:image/png;base64,${base64Image}`;

  } catch (error: any) {
    console.error("Lyntai Generation Error:", error);
    throw new Error(error.message || "Unknown generation error");
  }
};