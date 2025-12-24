import React, { useState } from 'react';
import { Lock, AlertCircle, Cake } from 'lucide-react';

interface PasswordModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  const correctPassword = '41';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        className={`
          relative w-full max-w-md
          bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50
          border-4 border-pink-400
          rounded-2xl shadow-2xl
          p-8
          animate-pop-up
          ${isShaking ? 'animate-shake' : ''}
        `}
        style={{
          animation: isShaking ? 'shake 0.5s' : undefined
        }}
      >
        {/* Decorative header */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <Cake className="text-white" size={40} />
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-display font-bold text-purple-900 mb-2">
            🎂 生日宝箱 🎂
          </h2>
          <p className="text-gray-600 mb-6">
            输入密码解锁老登的生日祝福
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="请输入密码"
                className={`
                  w-full px-4 py-3 text-center text-2xl font-bold
                  rounded-lg border-2 
                  focus:outline-none focus:ring-4
                  transition-all
                  ${error 
                    ? 'border-red-400 bg-red-50 text-red-600 focus:ring-red-200' 
                    : 'border-pink-300 bg-white text-gray-800 focus:ring-pink-200'
                  }
                `}
                autoFocus
                maxLength={10}
              />
              
              {error && (
                <div className="mt-2 flex items-center justify-center gap-2 text-red-600 animate-fade-in">
                  <AlertCircle size={16} />
                  <span className="text-sm">密码错误，请重试</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-pink-600 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              🎁 解锁生日祝福
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-500">
            提示：V大黄50告诉你密码，童叟无欺~ ✉️
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-2xl animate-bounce">🎈</div>
        <div className="absolute bottom-4 left-4 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎉</div>
        <div className="absolute top-1/2 left-4 text-xl animate-float" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-1/2 right-4 text-xl animate-float" style={{ animationDelay: '1.5s' }}>🎊</div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default PasswordModal;

