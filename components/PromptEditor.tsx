import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Plus, Trash2, StopCircle } from 'lucide-react';

interface PromptEditorProps {
  onGenerate: (prompts: string[]) => void;
  onStop?: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ onGenerate, onStop, isGenerating, disabled }) => {
  const [inputText, setInputText] = useState("A futuristic city floating in the clouds, clean white aesthetics.\nA close up of a mechanical hummingbird drinking nectar.\nAn oil painting of a cozy cottage in the woods.");
  
  const prompts = inputText.split('\n').filter(p => p.trim() !== '');

  const handleGenerateClick = () => {
    if (isGenerating) {
        if (onStop) onStop();
        return;
    }
    if (prompts.length === 0) return;
    onGenerate(prompts);
  };

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-black/20 border-r border-white/5 w-full lg:w-[450px] flex-shrink-0 backdrop-blur-md">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-white font-display font-bold text-lg mb-2 tracking-tight">Script / Shot List</h2>
        <p className="text-xs text-slate-400 font-light leading-relaxed">Enter one prompt per line. Each line generates exactly one image in your sequence.</p>
      </div>
      
      <div className="flex-1 p-0 relative group">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isGenerating}
          className="w-full h-full bg-transparent text-slate-200 p-6 outline-none resize-none font-mono text-sm leading-8 placeholder-white/20 focus:bg-white/[0.02] transition-colors"
          placeholder={`A sprawling cyberpunk metropolis...\nA quiet zen garden with cherry blossoms...\nA 3D render of a cute robot...`}
          spellCheck={false}
        />
        <div className="absolute bottom-6 right-6 text-[10px] font-bold tracking-widest text-slate-500 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full uppercase backdrop-blur-sm">
          {prompts.length} Shots
        </div>
      </div>

      <div className="p-6 border-t border-white/5 bg-gradient-to-b from-transparent to-black/20 flex flex-col gap-4">
        <button
          onClick={handleGenerateClick}
          disabled={!isGenerating && (prompts.length === 0)}
          className={`
            relative group flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold transition-all shadow-xl overflow-hidden
            ${isGenerating 
                ? 'text-white shadow-red-900/30'
                : (prompts.length === 0 
                    ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5' 
                    : 'text-white shadow-indigo-900/40 hover:shadow-indigo-900/60 hover:-translate-y-0.5')
            }
          `}
        >
          {isGenerating ? (
             <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600"></div>
          ) : (
             !(!isGenerating && prompts.length === 0) && <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_100%] animate-[shimmer_3s_infinite]"></div>
          )}
          
          <div className="relative flex items-center gap-3">
            {isGenerating ? (
                <>
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span className="tracking-wider text-sm">STOP GENERATION</span>
                </>
            ) : (
                <>
                <Play className="w-4 h-4 fill-current" />
                <span className="tracking-wider text-sm">GENERATE SEQUENCE</span>
                </>
            )}
          </div>
        </button>

        <button
            onClick={handleClear}
            disabled={disabled || isGenerating}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all text-xs tracking-wide uppercase"
        >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Script
        </button>
      </div>
    </div>
  );
};

export default PromptEditor;