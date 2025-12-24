import React from 'react';
import { Gift, Check } from 'lucide-react';

interface GiftBoxProps {
  id: number;
  isOpen: boolean;
  onClick: () => void;
  isSpecial?: boolean;
}

const GiftBox: React.FC<GiftBoxProps> = ({ id, isOpen, onClick, isSpecial }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center 
        w-28 h-28 md:w-40 md:h-40 
        rounded-xl cursor-pointer transition-all duration-300 
        shadow-lg hover:shadow-2xl hover:-translate-y-1
        ${isOpen 
          ? 'bg-christmas-green/20 border-2 border-christmas-green/50 text-christmas-green grayscale-0' 
          : 'bg-gradient-to-br from-christmas-red to-red-800 border-2 border-christmas-gold text-christmas-gold animate-fade-in'
        }
      `}
    >
      {/* Box Lid Effect */}
      {!isOpen && (
        <div className="absolute top-0 w-full h-1/4 bg-red-900/30 rounded-t-xl z-0" />
      )}
      
      {/* Ribbon */}
      {!isOpen && (
        <>
          <div className="absolute w-4 h-full bg-christmas-gold/80 left-1/2 -translate-x-1/2 z-0" />
          <div className="absolute w-full h-4 bg-christmas-gold/80 top-1/2 -translate-y-1/2 z-0" />
        </>
      )}

      {/* Content */}
      <div className="z-10 flex flex-col items-center gap-2">
        {isOpen ? (
            <>
                <Check size={40} className="animate-pop-up" />
                <span className="text-xs md:text-sm font-bold font-body">Opened</span>
            </>
        ) : (
            <>
                <Gift 
                    size={40} 
                    className="animate-pulse-slow drop-shadow-md group-hover:animate-shake" 
                    strokeWidth={1.5}
                />
                <span className="text-xl md:text-2xl font-display font-bold text-white drop-shadow-md">
                    {id}
                </span>
            </>
        )}
      </div>
    </div>
  );
};

export default GiftBox;
