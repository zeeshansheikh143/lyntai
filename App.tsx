import React, { useState, useCallback, useRef } from 'react';
import ControlBar from './components/ControlBar';
import PromptEditor from './components/PromptEditor';
import Storyboard from './components/Storyboard';
import LyntaiBackground from './components/LyntaiBackground';
import { generateImage } from './services/geminiService';
import JSZip from 'jszip';
import { 
  GenerationSettings, 
  StoryboardFrame, 
  GenerationStatus, 
  ModelType, 
  AspectRatio
} from './types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GenerationSettings>({
    model: ModelType.FLASH,
    aspectRatio: AspectRatio.LANDSCAPE,
    theme: '',
    category: '', 
    globalColorPalette: ''
  });

  const [frames, setFrames] = useState<StoryboardFrame[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef(false);

  const handleGenerate = useCallback(async (prompts: string[]) => {
    setIsGenerating(true);
    abortRef.current = false;
    
    const newFrames: StoryboardFrame[] = prompts.map((prompt, index) => ({
      id: crypto.randomUUID(),
      prompt,
      originalPromptIndex: index,
      status: GenerationStatus.PENDING,
    }));
    
    setFrames(newFrames);

    for (let i = 0; i < newFrames.length; i++) {
      if (abortRef.current) {
        setFrames(prev => prev.map((f, idx) => idx >= i ? { ...f, status: GenerationStatus.SKIPPED } : f));
        break;
      }

      const currentFrame = newFrames[i];
      setFrames(prev => prev.map(f => f.id === currentFrame.id ? { ...f, status: GenerationStatus.GENERATING } : f));

      try {
        const imageUrl = await generateImage(currentFrame.prompt, settings);
        
        if (abortRef.current) {
             setFrames(prev => prev.map(f => f.id === currentFrame.id ? { ...f, status: GenerationStatus.SKIPPED } : f));
             break;
        }

        setFrames(prev => prev.map(f => f.id === currentFrame.id ? { 
          ...f, 
          status: GenerationStatus.COMPLETED,
          imageUrl: imageUrl
        } : f));

      } catch (error: any) {
        setFrames(prev => prev.map(f => f.id === currentFrame.id ? { 
            ...f, 
            status: GenerationStatus.FAILED,
            error: error.message
          } : f));
      }
    }

    setIsGenerating(false);
  }, [settings]);

  const handleStop = useCallback(() => {
    abortRef.current = true;
  }, []);

  const handleDownloadZip = useCallback(async () => {
    const completedFrames = frames.filter(f => f.status === GenerationStatus.COMPLETED && f.imageUrl);
    if (completedFrames.length === 0) return;

    const zip = new JSZip();
    const folderName = `lyntai_project_${new Date().toISOString().replace(/[:.]/g, '-')}`;
    const folder = zip.folder(folderName);

    if (folder) {
        completedFrames.forEach((frame, index) => {
            if (frame.imageUrl) {
                const base64Data = frame.imageUrl.split(',')[1];
                const cleanPrompt = frame.prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_');
                folder.file(`shot_${String(index + 1).padStart(2, '0')}_${cleanPrompt}.png`, base64Data, { base64: true });
            }
        });

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${folderName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }, [frames]);

  return (
    <div className="relative flex flex-col h-screen overflow-hidden text-slate-200 bg-transparent font-sans">
      
      {/* Background is now exclusively LyntaiBackground */}
      <LyntaiBackground />

      <ControlBar 
        settings={settings} 
        onSettingsChange={setSettings} 
        disabled={isGenerating}
        onDownloadZip={handleDownloadZip}
        hasFrames={frames.some(f => f.status === GenerationStatus.COMPLETED)}
      />

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden z-10">
        <PromptEditor 
          onGenerate={handleGenerate} 
          onStop={handleStop}
          isGenerating={isGenerating}
          disabled={isGenerating}
        />
        <Storyboard 
            frames={frames} 
            aspectRatio={settings.aspectRatio}
        />
      </div>
    </div>
  );
};

export default App;