import React, { useState, useEffect, useRef } from 'react';
import { X, Quote, Fingerprint, MousePointerClick, Cake, PartyPopper } from 'lucide-react';
import { WishData, GoldenWishData } from '../types';

interface ModalProps {
  data: WishData | GoldenWishData;
  onClose: () => void;
  isGolden?: boolean;
}

interface DanmuItem {
  id: number;
  text: string;
  top: number; // Percentage
  duration: number; // Seconds
  fontSize: number;
}

const Modal: React.FC<ModalProps> = ({ data, onClose, isGolden = false }) => {
  const [isNameRevealed, setIsNameRevealed] = useState(false);
  
  // Controls how many lines are currently visible. Starts with 0.
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const totalLines = data.message.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Danmu State
  const [activeDanmus, setActiveDanmus] = useState<DanmuItem[]>([]);
  
  // Ref for the last visible line to auto-scroll to it
  const lastLineRef = useRef<HTMLParagraphElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const isWishData = (d: any): d is WishData => 'name' in d;
  const isBirthday = isWishData(data) && data.isSpecial;

  // Reset state if data changes
  useEffect(() => {
    setIsNameRevealed(false);
    setVisibleLineCount(0);
    setActiveDanmus([]);
  }, [data]);

  // Auto-scroll to the latest line when visibleLineCount changes
  useEffect(() => {
    if (visibleLineCount > 0 && lastLineRef.current) {
      // Use smooth scroll to the latest line
      lastLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Center the line in view
      });
    }
  }, [visibleLineCount]);

  // Check for Danmu trigger when line count changes
  useEffect(() => {
    // Check if the currently revealed line (index = visibleLineCount - 1) has danmu config
    if (isWishData(data) && data.danmuConfig && visibleLineCount > 0) {
       const lineIndex = visibleLineCount - 1;
       if (data.danmuConfig[lineIndex]) {
          const texts = data.danmuConfig[lineIndex];
          // Generate multiple instances of danmu for effect
          const newDanmus: DanmuItem[] = [];
          // Create about 30 flying comments
          for (let i = 0; i < 30; i++) {
              newDanmus.push({
                id: Date.now() + i,
                text: texts[i % texts.length],
                top: 5 + Math.random() * 80, // Random top position 5% - 85%
                duration: 3 + Math.random() * 5, // Random speed 3s - 8s
                fontSize: 16 + Math.random() * 20 // Random size
              });
          }
          setActiveDanmus(prev => [...prev, ...newDanmus]);
       }
    }
  }, [visibleLineCount, data]);

  // Auto-advance logic: Show next line every 3 seconds if not clicked
  useEffect(() => {
    // If all lines shown, stop timer
    if (visibleLineCount >= totalLines) return;

    timerRef.current = setInterval(() => {
      setVisibleLineCount((prev) => {
        if (prev < totalLines) return prev + 1;
        return prev;
      });
    }, 3000); // 3 seconds per line

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visibleLineCount, totalLines]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleReveal = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsNameRevealed(true);
  };

  // Click anywhere in modal to immediately show the next line
  const handleAdvanceText = () => {
    if (visibleLineCount < totalLines) {
      // Reset timer to avoid double jumping
      if (timerRef.current) {
        clearInterval(timerRef.current);
        // Restart timer for the *next* line after this one
        timerRef.current = setInterval(() => {
             setVisibleLineCount((prev) => prev < totalLines ? prev + 1 : prev);
        }, 3000);
      }
      // Show next line immediately
      setVisibleLineCount(prev => prev + 1);
    }
  };

  // Birthday specific styles
  const containerClasses = isBirthday 
    ? 'bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 border-4 border-pink-300 shadow-[0_0_30px_rgba(244,114,182,0.6)] text-gray-800'
    : isGolden
        ? 'bg-christmas-cream border-4 border-christmas-gold ring-4 ring-christmas-gold/30 text-christmas-dark'
        : 'bg-christmas-cream border-4 border-christmas-red text-christmas-dark';

  return (
    <>
      {/* Danmu Layer - Rendered outside modal container but inside overlay */}
      {activeDanmus.length > 0 && (
          <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
            {activeDanmus.map(item => (
              <div
                key={item.id}
                className="absolute whitespace-nowrap text-white font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] animate-danmu"
                style={{
                  top: `${item.top}%`,
                  fontSize: `${item.fontSize}px`,
                  animationDuration: `${item.duration}s`
                }}
              >
                {item.text}
              </div>
            ))}
          </div>
      )}

      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
      >
        <div 
          className={`
            relative w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden
            rounded-xl shadow-2xl animate-pop-up
            cursor-pointer transition-colors select-none
            ${containerClasses}
          `}
          onClick={handleAdvanceText} 
        >
          {/* Floating decorations for Birthday */}
          {isBirthday && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-10 left-5 text-4xl animate-float" style={{ animationDelay: '0s' }}>🎈</div>
              <div className="absolute top-20 right-10 text-3xl animate-float" style={{ animationDelay: '2s' }}>🎉</div>
              <div className="absolute bottom-10 left-10 text-4xl animate-float" style={{ animationDelay: '1s' }}>🎂</div>
              <div className="absolute bottom-32 right-5 text-4xl animate-float" style={{ animationDelay: '3s' }}>🎈</div>
            </div>
          )}

          {/* Helper text */}
          {visibleLineCount < totalLines && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-gray-400 text-xs flex items-center gap-1 animate-pulse z-20 bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm">
              <MousePointerClick size={12} />
              <span>点击加速展示</span>
            </div>
          )}

          {/* Header Decoration */}
          <div className={`h-4 w-full relative z-10 ${isBirthday ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400' : (isGolden ? 'bg-gradient-to-r from-yellow-300 via-christmas-gold to-yellow-600' : 'bg-christmas-red')}`} />

          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200/50 transition-colors text-gray-500 z-50"
          >
            <X size={24} />
          </button>

          <div className="p-8 md:p-12 flex flex-col gap-8 relative z-10">
              
              {/* Quote Section */}
              <div 
                className={`
                  relative p-6 rounded-lg shadow-inner italic text-gray-600 font-body text-lg leading-relaxed text-center animate-fade-in
                  ${isBirthday ? 'bg-white/80' : 'bg-white'}
                `}
                style={{ animationDelay: '0.2s' }}
              >
                  <Quote size={24} className="absolute top-2 left-2 text-christmas-gold opacity-50 rotate-180" />
                  <p>{data.quote}</p>
                  <Quote size={24} className="absolute bottom-2 right-2 text-christmas-gold opacity-50" />
              </div>

              {/* Main Message */}
              <div className="space-y-6 font-body text-base md:text-lg text-center md:text-left leading-relaxed min-h-[100px]">
                  {data.message.map((para, idx) => {
                      if (idx >= visibleLineCount) return null;

                      // Check if this is the last visible line
                      const isLastLine = idx === visibleLineCount - 1;

                      return (
                          <p 
                            key={idx}
                            ref={isLastLine ? lastLineRef : null}
                            className={`
                              animate-fade-in
                              ${isGolden ? "text-center font-medium" : ""}
                              ${isBirthday ? "font-medium text-purple-900" : ""}
                            `}
                            style={{ animationDuration: '0.5s' }}
                          >
                            {para}
                          </p>
                      );
                  })}
              </div>

              {/* Reveal Section */}
              <div className={`flex flex-col items-center mt-4 transition-opacity duration-500 ${visibleLineCount >= totalLines ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {!isNameRevealed ? (
                  <button
                    onClick={handleReveal}
                    className={`
                      group flex items-center gap-2 px-6 py-3 rounded-full text-white font-display text-xl transition-all duration-300 hover:scale-105 shadow-lg
                      ${isBirthday ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' : (isGolden ? 'bg-christmas-gold hover:bg-yellow-500' : 'bg-christmas-red hover:bg-red-700')}
                    `}
                  >
                    {isBirthday ? <PartyPopper size={20} /> : <Fingerprint size={20} />}
                    <span>点击揭晓</span>
                  </button>
                ) : (
                  <div className="w-full animate-pop-up">
                    {/* Name & Signature */}
                    <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-3">
                          {isBirthday && <Cake className="text-pink-500 animate-bounce" size={32} />}
                          <h2 className={`font-display text-4xl md:text-5xl mb-2 drop-shadow-sm ${isBirthday ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600' : 'text-christmas-red'}`}>
                              {isBirthday ? "Happy Birthday!" : (isWishData(data) ? data.name : data.title)}
                          </h2>
                          {isBirthday && <Cake className="text-pink-500 animate-bounce" size={32} />}
                        </div>
                        
                        {isWishData(data) && !data.isSpecial && (
                          <div className="w-16 h-1 bg-christmas-green mx-auto rounded-full opacity-50" />
                        )}
                    </div>

                    <div className={`text-right mt-2 font-display text-2xl ${isBirthday ? 'text-purple-600' : 'text-christmas-green'}`}>
                        ~ {data.signature}
                    </div>
                  </div>
                )}
              </div>
          </div>
          
          {/* Footer Decoration */}
          <div className={`h-4 w-full relative z-10 ${isBirthday ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400' : (isGolden ? 'bg-gradient-to-r from-yellow-300 via-christmas-gold to-yellow-600' : 'bg-christmas-green')}`} />
        </div>
      </div>
    </>
  );
};

export default Modal;