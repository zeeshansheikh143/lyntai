import { GoogleGenAI } from "@google/genai";

export const config = {
  maxDuration: 60, // Increase timeout for image generation
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt: rawPrompt, settings } = req.body;

  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'API_KEY environment variable is not set on the server.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let fullPrompt = `Generate an image based on the following instructions.\n`;
    fullPrompt += `Style Guideline: Default to photorealistic, cinematic photography unless the prompt explicitly requests a different style (e.g. illustration, sketch, 3D render, pixel art).\n`;

    if (settings.category) fullPrompt += `Genre / Context: ${settings.category}.\n`;
    if (settings.theme) fullPrompt += `Theme / Mood: ${settings.theme}.\n`;
    if (settings.globalColorPalette) fullPrompt += `Color Palette: ${settings.globalColorPalette}.\n`;

    fullPrompt += `\nSubject / Action: ${rawPrompt}`;

    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: settings.aspectRatio === '21:9' ? '16:9' : (settings.aspectRatio || '16:9'),
        },
      },
    });

    let base64Image: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      return res.status(400).json({ error: 'No image data returned from Gemini.' });
    }

    return res.status(200).json({ imageUrl: `data:image/png;base64,${base64Image}` });

  } catch (error: any) {
    console.error("Vercel Backend Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error during generation' });
  }
}