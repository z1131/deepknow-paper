/**
 * 登录弹窗组件
 * 复用 goodtalk 的登录 UI 样式
 * 支持：访客试用、手机号验证码登录
 */
import React, { useState, useEffect } from 'react';
import { Smartphone, Globe, ArrowLeft, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'phone'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 手机号验证码登录状态
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 重置状态
  useEffect(() => {
    if (!isOpen) {
      setView('login');
      setError(null);
      setPhone('');
      setCode('');
      setCountdown(0);
      setDevCode(null);
    }
  }, [isOpen]);

  // 访客登录
  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await authService.guestLogin();
      if (res.success && res.user) {
        onLoginSuccess({
          id: String(res.user.id),
          username: res.user.nickname || res.user.username,
          avatar: res.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
          isGuest: true,
          token: res.tempToken,
        });
      } else {
        setError(res.message || '访客登录失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 发送验证码
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
        // 开发模式下显示验证码
        if (res.code) {
          setDevCode(res.code);
          setCode(res.code); // 自动填充
        }
      } else {
        setError(res.message || '发送失败');
        if (res.lockUntil) {
          const seconds = Math.ceil((res.lockUntil - Date.now()) / 1000);
          setCountdown(seconds > 0 ? seconds : 0);
        }
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 验证码登录
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
      if (res.success && res.user && res.tempToken) {
        onLoginSuccess({
          id: String(res.user.id),
          username: res.user.nickname || res.user.username,
          avatar: res.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + res.user.id,
          phone: res.user.phone,
          email: res.user.email,
          isGuest: false,
          token: res.tempToken,
        });
      } else {
        setError(res.message || '登录失败');
        if (res.lockUntil) {
          const seconds = Math.ceil((res.lockUntil - Date.now()) / 1000);
          if (seconds > 0) {
            setError(`账号已锁定，请 ${seconds} 秒后重试`);
          }
        }
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">DeepKnow Paper</span>
          </div>
          <p className="text-white/80 text-sm mt-2">AI 驱动的论文写作助手</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {view === 'login' ? (
            // 主登录页面
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">欢迎开始使用</h2>

              <div className="space-y-3">
                {/* 手机号登录按钮 */}
                <button
                  type="button"
                  onClick={() => setView('phone')}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  <Smartphone className="w-4 h-4" />
                  手机号验证码登录
                </button>

                {/* 访客试用按钮 */}
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 font-medium text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      访客试用
                    </>
                  )}
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-gray-500">
                登录即代表您同意服务条款和隐私政策
              </p>
            </div>
          ) : (
            // 手机号验证码登录页面
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => { setView('login'); setError(null); setDevCode(null); }}
                  className="p-2 -ml-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition"
                  title="返回"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">手机号登录</h2>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* 开发模式验证码提示 */}
              {devCode && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm">
                  开发模式验证码: <span className="font-mono font-bold">{devCode}</span>
                </div>
              )}

              <form onSubmit={handlePhoneLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    placeholder="请输入11位手机号"
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="请输入验证码"
                      className="flex-1 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition"
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                    />
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={countdown > 0 || isLoading || phone.length !== 11}
                      className="px-4 py-3 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !phone || !code}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '登 录'}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-gray-500">
                未注册的手机号将自动创建账号
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
