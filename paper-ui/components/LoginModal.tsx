import React, { useState, useEffect } from 'react';
import { X, Phone, User as UserIcon, Loader2, ArrowLeft, MessageSquare } from 'lucide-react';
import { authService } from '../services/authService';
import { tokenManager } from '../services/axios';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'phone'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phone login state
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setView('login');
      setError(null);
      setPhone('');
      setCode('');
      setDevCode(null);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await authService.guestLogin();
      onLoginSuccess();
      onClose();
    } catch (err) {
      setError('访客登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await authService.sendCode(phone);
      if (res.success) {
        setCountdown(60);
        // Show code in dev/demo mode if returned
        if (res.code) {
          setDevCode(res.code);
          setCode(res.code); 
        }
      } else {
        setError(res.message || '发送失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !code) {
      setError('请输入手机号和验证码');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await authService.loginByCode(phone, code);
      if (res.success) {
        onLoginSuccess();
        onClose();
      } else {
        setError(res.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
            {/* Header Branding */}
            <div className="mb-8 flex flex-col items-center">
               <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md mb-3">
                  <MessageSquare className="w-6 h-6" />
               </div>
               <h2 className="text-xl font-bold text-gray-900">DeepKnow Paper</h2>
               <p className="text-sm text-gray-500 mt-1">您的 AI 学术助手</p>
            </div>

            {view === 'login' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">欢迎回来</h3>
                    
                    <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => setView('phone')}
                          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 font-medium shadow-md hover:shadow-lg transform active:scale-[0.98]"
                        >
                           <Phone className="w-4 h-4" />
                           手机号验证码登录
                        </button>
                         
                        <button
                          type="button"
                          onClick={handleGuestLogin}
                          disabled={isLoading}
                          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition duration-200 font-medium text-gray-700 bg-white"
                        >
                           {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserIcon className="w-4 h-4" />}
                           访客试用
                        </button>
                    </div>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        登录即代表同意 <span className="text-blue-600 cursor-pointer">服务条款</span> 和 <span className="text-blue-600 cursor-pointer">隐私政策</span>
                    </p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-2 mb-6">
                        <button 
                            onClick={() => { setView('login'); setError(null); }}
                            className="p-1.5 -ml-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold text-gray-900">手机号登录</h3>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {devCode && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-sm font-mono text-center">
                            测试验证码: {devCode}
                        </div>
                    )}

                    <form onSubmit={handlePhoneLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">手机号</label>
                            <input 
                                type="tel" 
                                required
                                maxLength={11}
                                placeholder="请输入11位手机号"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition"
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">验证码</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="000000"
                                    className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition tracking-widest text-center"
                                    value={code}
                                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                                />
                                <button
                                    type="button"
                                    onClick={handleSendCode}
                                    disabled={countdown > 0 || isLoading || phone.length !== 11}
                                    className="px-4 bg-blue-50 text-blue-600 font-medium text-sm rounded-xl hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[100px]"
                                >
                                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !phone || !code}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                             {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '登录 / 注册'}
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};