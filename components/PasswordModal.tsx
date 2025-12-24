import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

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
          bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100
          border-4 border-yellow-400
          rounded-2xl shadow-2xl
          p-8
          animate-pop-up
          ${isShaking ? 'animate-shake' : ''}
        `}
      >
        {/* Decorative header */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <Lock className="text-white" size={40} />
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-display font-bold text-yellow-900 mb-2">
            🎂 生日宝箱 🎂
          </h2>
          <p className="text-gray-600 mb-6">
            输入密码解锁专属祝福
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
                    : 'border-yellow-300 bg-white text-gray-800 focus:ring-yellow-200'
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
              className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              🎁 解锁宝箱
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-500">
            提示：密码是一个数字 🔢
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-2xl animate-bounce">✨</div>
        <div className="absolute bottom-4 left-4 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎈</div>
      </div>
    </div>
  );
};

export default PasswordModal;

