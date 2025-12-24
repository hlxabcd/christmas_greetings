import React from 'react';
import { Star } from 'lucide-react';

interface GoldenBoxProps {
  onClick: () => void;
}

const GoldenBox: React.FC<GoldenBoxProps> = ({ onClick }) => {
  return (
    <div className="w-full flex justify-center mt-12 animate-pop-up">
      <div 
        onClick={onClick}
        className="
          relative group cursor-pointer
          w-64 h-24 md:w-80 md:h-32
          bg-gradient-to-r from-yellow-300 via-christmas-gold to-yellow-600
          rounded-2xl shadow-[0_0_50px_rgba(248,178,41,0.6)]
          flex items-center justify-center
          transition-all duration-300 hover:scale-105
          border-4 border-yellow-200
        "
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl" />
        
        <div className="z-10 flex items-center gap-3 text-red-900">
           <Star className="animate-spin-slow text-yellow-100 fill-yellow-100" size={32} />
           <span className="font-display text-2xl md:text-3xl font-bold tracking-widest drop-shadow-sm">
             点击开启惊喜
           </span>
           <Star className="animate-spin-slow text-yellow-100 fill-yellow-100" size={32} />
        </div>
        
        {/* Particles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-200 rounded-full animate-bounce" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-200 rounded-full animate-bounce-slow" />
      </div>
    </div>
  );
};

export default GoldenBox;
