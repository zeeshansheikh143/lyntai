export enum GenerationStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED'
}

export enum ModelType {
  FLASH = 'gemini-2.5-flash-image',
  PRO = 'gemini-3-pro-image-preview'
}

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  CINEMATIC = '21:9', // Mapped to 16:9 with letterboxing in prompt if needed, but API supports 16:9
  CLASSIC = '4:3'
}

export interface StoryboardFrame {
  id: string;
  prompt: string;
  originalPromptIndex: number;
  status: GenerationStatus;
  imageUrl?: string;
  error?: string;
}

export interface GenerationSettings {
  model: ModelType;
  aspectRatio: AspectRatio;
  theme: string;
  category: string;
  globalColorPalette: string;
}
