import React from 'react';
import { GenerationSettings, ModelType, AspectRatio } from '../types';
import { Video, AlertTriangle, Globe, Download, Sparkles } from 'lucide-react';

interface ControlBarProps {
  settings: GenerationSettings;
  onSettingsChange: (newSettings: GenerationSettings) => void;
  disabled: boolean;
  onDownloadZip?: () => void;
  hasFrames?: boolean;
}

const ControlBar: React.FC<ControlBarProps> = ({ settings, onSettingsChange, disabled, onDownloadZip, hasFrames }) => {
  
  const handleChange = (key: keyof GenerationSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-4 sticky top-0 z-20 shadow-2xl shadow-purple-900/20">
      <div className="max-w-[1920px] mx-auto flex flex-col xl:flex-row gap-6 xl:items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-4 text-white font-bold text-2xl min-w-fit group cursor-default">
            <div className="relative p-2 rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <div className="relative bg-black/50 p-1 rounded-md">
                 <Sparkles className="w-6 h-6 text-cyan-100" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-purple-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Lyntai</span>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-400/80 font-medium">Universal Mode</span>
                 <div className="h-px w-8 bg-purple-500/30"></div>
              </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 gap-4 w-full items-center">
          
          {/* Tech Specs Group */}
          <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm shadow-inner shadow-black/20 hover:bg-white/10 transition-colors">
            {/* Model Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-purple-300/70 font-bold uppercase tracking-widest font-display">Model</label>
              <div className="relative">
                <select
                  disabled={disabled}
                  value={settings.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="appearance-none bg-black/20 text-slate-200 text-xs rounded-lg border border-white/10 px-4 py-2.5 pr-8 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none cursor-pointer w-40 font-medium transition-all hover:bg-black/40"
                >
                  <option value={ModelType.FLASH}>Gemini 2.5 Flash</option>
                  <option value={ModelType.PRO}>Gemini 3 Pro</option>
                </select>
                {settings.model === ModelType.PRO && (
                   <span className="absolute -top-1 -right-1 flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                 </span>
                )}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-purple-300/70 font-bold uppercase tracking-widest font-display">Aspect</label>
              <div className="relative">
                <select
                  disabled={disabled}
                  value={settings.aspectRatio}
                  onChange={(e) => handleChange('aspectRatio', e.target.value)}
                  className="appearance-none bg-black/20 text-slate-200 text-xs rounded-lg border border-white/10 px-4 py-2.5 pr-8 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none w-36 font-medium transition-all hover:bg-black/40"
                >
                  <option value={AspectRatio.SQUARE}>1:1 Square</option>
                  <option value={AspectRatio.LANDSCAPE}>16:9 Landscape</option>
                  <option value={AspectRatio.PORTRAIT}>9:16 Portrait</option>
                  <option value={AspectRatio.CLASSIC}>4:3 Classic</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Creative Specs Group */}
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm shadow-inner shadow-black/20 flex-1 w-full hover:bg-white/10 transition-colors">
             {/* Genre / Style Input */}
             <div className="flex flex-col gap-2 md:w-56">
              <label className="text-[10px] text-purple-300/70 font-bold uppercase tracking-widest font-display">Genre / Style</label>
              <input
                 type="text"
                 disabled={disabled}
                 value={settings.category}
                 onChange={(e) => handleChange('category', e.target.value)}
                 placeholder="e.g. Sci-Fi, Noir, Anime"
                 className="bg-black/20 text-white text-xs rounded-lg border border-white/10 px-4 py-2.5 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none w-full placeholder-white/20 transition-all hover:bg-black/40"
              />
            </div>

            {/* Theme Input */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-[10px] text-purple-300/70 font-bold uppercase tracking-widest font-display">Theme / Mood</label>
              <input
                 type="text"
                 disabled={disabled}
                 value={settings.theme}
                 onChange={(e) => handleChange('theme', e.target.value)}
                 placeholder="e.g. Golden hour, peaceful, high tech..."
                 className="bg-black/20 text-white text-xs rounded-lg border border-white/10 px-4 py-2.5 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none w-full placeholder-white/20 transition-all hover:bg-black/40"
              />
            </div>

             {/* Color Palette Input */}
             <div className="flex flex-col gap-2 md:w-56">
              <label className="text-[10px] text-purple-300/70 font-bold uppercase tracking-widest font-display">Color Palette</label>
              <input
                 type="text"
                 disabled={disabled}
                 value={settings.globalColorPalette}
                 onChange={(e) => handleChange('globalColorPalette', e.target.value)}
                 placeholder="e.g. Neon, Pastel, B&W"
                 className="bg-black/20 text-white text-xs rounded-lg border border-white/10 px-4 py-2.5 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none w-full placeholder-white/20 transition-all hover:bg-black/40"
              />
            </div>
          </div>
          
           {/* Download Button */}
           <div className="flex items-center">
             <button
               onClick={onDownloadZip}
               disabled={!hasFrames || disabled}
               className={`
                 group relative flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all overflow-hidden
                 ${!hasFrames || disabled
                   ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5' 
                   : 'text-white border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                 }
               `}
               title="Download Project ZIP"
             >
               {!(!hasFrames || disabled) && (
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
               )}
               <div className="relative flex items-center gap-2">
                 <Download className="w-5 h-5" />
                 <span className="hidden xl:inline text-sm tracking-wide">EXPORT ZIP</span>
               </div>
             </button>
           </div>

        </div>
      </div>
      
      {settings.model === ModelType.PRO && (
        <div className="max-w-[1920px] mx-auto mt-2 flex items-center justify-end gap-2 text-[10px] text-amber-500/80 font-mono">
          <AlertTriangle className="w-3 h-3" />
          <span>PAID API KEY REQUIRED FOR GEMINI 3 PRO</span>
        </div>
      )}
    </div>
  );
};

export default ControlBar;