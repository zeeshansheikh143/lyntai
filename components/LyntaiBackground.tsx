import React from 'react';

const LyntaiBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#020617] overflow-hidden">
      {/* 
        =============================================================================
        HOW TO CHANGE THE IMAGE:
        1. Upload your image to the project (e.g. inside a 'public' folder) OR use an external URL.
        2. Replace the URL inside the `backgroundImage` property below.
        =============================================================================
      */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[60s]"
        style={{
          // ↓↓↓ REPLACE THE URL BELOW WITH YOUR IMAGE URL ↓↓↓
          backgroundImage: `url('https://images.unsplash.com/photo-1614728853913-1e2211f9ca36?q=80&w=3348&auto=format&fit=crop')`,
          // ↑↑↑ REPLACE THE URL ABOVE ↑↑↑
          
          animation: 'slowBreath 30s infinite alternate ease-in-out',
          opacity: 0.5
        }}
      />
      
      {/* Deep Space Gradients for Depth & Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-transparent to-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)]" />
      
      {/* Subtle Color Accent Overlay (Cyan/Purple) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-purple-900/10 mix-blend-overlay" />

      <style>{`
        @keyframes slowBreath {
          0% { transform: scale(1); filter: brightness(0.8); }
          100% { transform: scale(1.1); filter: brightness(1.0); }
        }
      `}</style>
    </div>
  );
};

export default LyntaiBackground;