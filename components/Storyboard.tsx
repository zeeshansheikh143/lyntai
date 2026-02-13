import React from 'react';
import { StoryboardFrame, GenerationStatus, AspectRatio } from '../types';
import { Download, AlertCircle, Clock, Image as ImageIcon, ZoomIn, Loader2 } from 'lucide-react';

interface StoryboardProps {
  frames: StoryboardFrame[];
  aspectRatio: AspectRatio;
}

const Storyboard: React.FC<StoryboardProps> = ({ frames, aspectRatio }) => {
  
  const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case AspectRatio.SQUARE: return 'aspect-square';
      case AspectRatio.LANDSCAPE: return 'aspect-video';
      case AspectRatio.PORTRAIT: return 'aspect-[9/16]';
      case AspectRatio.CLASSIC: return 'aspect-[4/3]';
      default: return 'aspect-video';
    }
  };

  const handleDownload = (imageUrl: string, id: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `frame-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (frames.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-8 h-full bg-transparent">
        <div className="p-8 rounded-full bg-white/5 border border-white/5 mb-6">
            <ImageIcon className="w-12 h-12 opacity-30 text-indigo-400" />
        </div>
        <p className="text-xl font-display font-medium text-slate-400">Your Canvas is Empty</p>
        <p className="text-sm text-slate-600 mt-2 max-w-md text-center font-light">Enter your prompts in the script editor to begin generating your cinematic sequence.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {frames.map((frame, index) => (
          <div key={frame.id} 
               className="group relative flex flex-col bg-white/[0.02] rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(217,119,6,0.1)] transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm"
               style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s backwards` }}
          >
            
            {/* Header / Numbering */}
            <div className="px-5 py-3 bg-black/40 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
              <span className="text-[10px] font-mono text-slate-500 tracking-widest">SHOT {String(index + 1).padStart(2, '0')}</span>
              <div className="flex items-center gap-2">
                 <div className={`h-1.5 w-1.5 rounded-full ${
                    frame.status === GenerationStatus.COMPLETED ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                    frame.status === GenerationStatus.FAILED ? 'bg-red-500' :
                    frame.status === GenerationStatus.GENERATING ? 'bg-amber-500 animate-pulse' :
                    'bg-slate-700'
                 }`}></div>
                 <span className={`text-[9px] uppercase font-bold tracking-wider ${
                    frame.status === GenerationStatus.COMPLETED ? 'text-emerald-500' :
                    frame.status === GenerationStatus.FAILED ? 'text-red-500' :
                    frame.status === GenerationStatus.GENERATING ? 'text-amber-500' :
                    'text-slate-600'
                }`}>
                    {frame.status}
                </span>
              </div>
            </div>

            {/* Image Container */}
            <div className={`relative w-full bg-black/50 ${getAspectRatioClass(aspectRatio)} overflow-hidden`}>
              {frame.status === GenerationStatus.COMPLETED && frame.imageUrl ? (
                <>
                  <img 
                    src={frame.imageUrl} 
                    alt={frame.prompt} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out animate-[fadeIn_0.8s_ease-out]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                    <button 
                        onClick={() => handleDownload(frame.imageUrl!, frame.id)}
                        className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 text-white transition-all transform hover:scale-110 border border-white/10 hover:border-white/30"
                        title="Download"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                     <button 
                        className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 text-white transition-all transform hover:scale-110 border border-white/10 hover:border-white/30"
                        onClick={() => window.open(frame.imageUrl, '_blank')}
                        title="View Full Size"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : frame.status === GenerationStatus.FAILED ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-6 text-center bg-red-900/5">
                  <AlertCircle className="w-8 h-8 mb-3 opacity-50" />
                  <p className="text-xs font-mono">{frame.error || "Generation Failed"}</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {frame.status === GenerationStatus.GENERATING ? (
                     <div className="relative flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                        <span className="text-[10px] text-amber-500/80 font-mono tracking-[0.2em] uppercase animate-pulse">Rendering</span>
                     </div>
                  ) : (
                    <div className="flex flex-col items-center opacity-30">
                        <Clock className="w-8 h-8 text-slate-400 mb-3" />
                        <span className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">Queued</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prompt Footer */}
            <div className="p-4 bg-white/[0.01] border-t border-white/5">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light font-sans opacity-80 group-hover:opacity-100 transition-opacity" title={frame.prompt}>
                    {frame.prompt}
                </p>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
};

export default Storyboard;