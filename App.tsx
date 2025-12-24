import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Snowfall from './components/Snowfall';
import GiftBox from './components/GiftBox';
import Modal from './components/Modal';
import GoldenBox from './components/GoldenBox';
import PasswordModal from './components/PasswordModal';
import { WISHES, GOLDEN_WISH } from './constants';
import { WishData, GoldenWishData } from './types';

// Updated music URLs
const MUSIC_URLS = {
  // Jingle Bells (Kevin MacLeod) - Creative Commons
  christmas: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Jingle%20Bells.mp3", 
  birthday: "https://cdn.pixabay.com/download/audio/2023/06/26/audio_cd13a5db91.mp3?filename=happy-birthday-155461.mp3"
};

type MusicTheme = 'christmas' | 'birthday';

const App: React.FC = () => {
  const [openedBoxIds, setOpenedBoxIds] = useState<number[]>([]);
  const [activeModal, setActiveModal] = useState<WishData | GoldenWishData | null>(null);
  const [isGoldenModal, setIsGoldenModal] = useState(false);
  const [showGoldenBox, setShowGoldenBox] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingBirthdayWish, setPendingBirthdayWish] = useState<WishData | null>(null);
  const [isBirthdayUnlocked, setIsBirthdayUnlocked] = useState(false);
  
  // Music State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const xmasAudioRef = useRef<HTMLAudioElement | null>(null);
  const bdayAudioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Track currently playing theme to avoid unnecessary fades
  const currentThemeRef = useRef<MusicTheme>('christmas');

  // Initialize Audio & Global "Autoplay" Listener
  useEffect(() => {
    xmasAudioRef.current = new Audio(MUSIC_URLS.christmas);
    xmasAudioRef.current.loop = true;
    xmasAudioRef.current.volume = 0.4;

    bdayAudioRef.current = new Audio(MUSIC_URLS.birthday);
    bdayAudioRef.current.loop = true;
    bdayAudioRef.current.volume = 0.5;

    // 1. Try to play immediately (might work in some browsers/settings)
    xmasAudioRef.current.play()
      .then(() => {
        setIsMusicPlaying(true);
        setHasInteracted(true);
      })
      .catch(() => {
        console.log("Autoplay blocked, waiting for interaction...");
      });

    // 2. Add global listener to "unlock" audio on FIRST click anywhere
    const unlockAudio = () => {
      if (xmasAudioRef.current && xmasAudioRef.current.paused && bdayAudioRef.current?.paused) {
        xmasAudioRef.current.play().then(() => {
           setIsMusicPlaying(true);
           setHasInteracted(true);
        }).catch(console.error);
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    return () => {
      xmasAudioRef.current?.pause();
      bdayAudioRef.current?.pause();
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Music Logic: Switch only when theme changes
  useEffect(() => {
    if (!hasInteracted || !isMusicPlaying) return;

    const isBirthdayActive = activeModal && 'isSpecial' in activeModal && activeModal.isSpecial;
    const targetTheme: MusicTheme = isBirthdayActive ? 'birthday' : 'christmas';

    // Only switch if the target theme is different from what we think is playing
    if (targetTheme !== currentThemeRef.current) {
        // Perform Switch
        if (targetTheme === 'birthday') {
            fadeOut(xmasAudioRef.current);
            fadeIn(bdayAudioRef.current);
        } else {
            fadeOut(bdayAudioRef.current);
            fadeIn(xmasAudioRef.current);
        }
        currentThemeRef.current = targetTheme;
    } else {
        // If theme is same, ensure it is playing (in case it was paused or interrupted)
        const currentAudio = targetTheme === 'birthday' ? bdayAudioRef.current : xmasAudioRef.current;
        if (currentAudio && currentAudio.paused) {
            currentAudio.play().catch(e => console.error("Resume failed", e));
        }
    }
  }, [activeModal, isMusicPlaying, hasInteracted]);

  const fadeIn = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            let vol = 0;
            audio.volume = vol;
            const interval = setInterval(() => {
              if (vol < 0.4) {
                vol += 0.05;
                audio.volume = Math.min(vol, 0.4);
              } else {
                clearInterval(interval);
              }
            }, 200);
        }).catch(error => {
            console.warn("Audio autoplay blocked during fade in:", error);
        });
    }
  };

  const fadeOut = (audio: HTMLAudioElement | null) => {
    if (!audio || audio.paused) return;
    let vol = audio.volume;
    const interval = setInterval(() => {
      if (vol > 0.05) {
        vol -= 0.05;
        audio.volume = vol;
      } else {
        audio.pause();
        audio.currentTime = 0;
        clearInterval(interval);
      }
    }, 200);
  };

  const toggleMusic = () => {
    setHasInteracted(true);
    
    if (isMusicPlaying) {
      // Pause all
      xmasAudioRef.current?.pause();
      bdayAudioRef.current?.pause();
      setIsMusicPlaying(false);
    } else {
      setIsMusicPlaying(true);
      // Play current theme
      const theme = currentThemeRef.current;
      if (theme === 'birthday') {
         bdayAudioRef.current?.play().catch(console.error);
      } else {
         xmasAudioRef.current?.play().catch(console.error);
      }
    }
  };

  // Check if all boxes are opened to show the Golden Box
  useEffect(() => {
    if (openedBoxIds.length === WISHES.length && WISHES.length > 0) {
      const timer = setTimeout(() => {
        setShowGoldenBox(true);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [openedBoxIds]);

  const handleBoxClick = (wish: WishData) => {
    // 检查是否是第8个礼物盒（李博的生日宝箱）
    if (wish.id === 8 && wish.isSpecial && !isBirthdayUnlocked) {
      // 显示密码弹窗
      setPendingBirthdayWish(wish);
      setShowPasswordModal(true);
      return;
    }
    
    // 其他礼物盒正常打开
    setActiveModal(wish);
    setIsGoldenModal(false);
    
    // Mark as opened if not already
    if (!openedBoxIds.includes(wish.id)) {
      const newOpened = [...openedBoxIds, wish.id];
      setOpenedBoxIds(newOpened);
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setIsBirthdayUnlocked(true);
    
    if (pendingBirthdayWish) {
      setActiveModal(pendingBirthdayWish);
      setIsGoldenModal(false);
      
      // Mark as opened
      if (!openedBoxIds.includes(pendingBirthdayWish.id)) {
        const newOpened = [...openedBoxIds, pendingBirthdayWish.id];
        setOpenedBoxIds(newOpened);
      }
      setPendingBirthdayWish(null);
    }
  };

  const handlePasswordClose = () => {
    setShowPasswordModal(false);
    setPendingBirthdayWish(null);
  };

  const handleGoldenClick = () => {
    setActiveModal(GOLDEN_WISH);
    setIsGoldenModal(true);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-body pb-20">
      <Snowfall />

      {/* Music Control */}
      <button 
        onClick={(e) => {
            e.stopPropagation(); // Prevent double triggering with global listener
            toggleMusic();
        }}
        className={`
            fixed top-4 right-4 z-50 p-3 backdrop-blur-md border rounded-full text-white transition-all shadow-lg
            ${isMusicPlaying ? 'bg-green-600/50 border-green-400 animate-pulse-slow' : 'bg-gray-800/50 border-gray-600'}
        `}
      >
        {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Hero Section */}
      <header className="relative z-10 pt-16 pb-8 px-4 text-center">
        <h1 className="font-display text-5xl md:text-7xl text-christmas-gold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-4 animate-bounce-slow">
          Merry Christmas
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
          & Happy New Year 2026
        </p>
      </header>

      {/* Main Grid */}
      <main className="relative z-10 container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 justify-items-center">
          {WISHES.map((wish) => (
            <GiftBox
              key={wish.id}
              id={wish.id}
              isOpen={openedBoxIds.includes(wish.id)}
              onClick={() => handleBoxClick(wish)}
              isSpecial={wish.isSpecial}
            />
          ))}
        </div>

        {/* Golden Box Reveal */}
        {showGoldenBox && (
          <div className="transition-all duration-1000 ease-in-out">
            <GoldenBox onClick={handleGoldenClick} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 text-center text-white/40 text-sm pb-8">
        <p>Made with ❤️ for my best friends</p>
      </footer>

      {/* Password Modal for Birthday Box */}
      {showPasswordModal && (
        <PasswordModal
          onSuccess={handlePasswordSuccess}
          onClose={handlePasswordClose}
        />
      )}

      {/* Modal */}
      {activeModal && (
        <Modal 
          data={activeModal} 
          onClose={handleCloseModal} 
          isGolden={isGoldenModal}
        />
      )}
    </div>
  );
};

export default App;