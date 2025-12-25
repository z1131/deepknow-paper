/**
 * 登录页面组件
 * 支持手机号 + 验证码登录
 */
import React, { useState } from 'react';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null); // 开发模式下显示验证码

  // 手机号验证
  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone);

  // 发送验证码
  const handleSendCode = async () => {
    if (!isPhoneValid) {
      setError('请输入正确的手机号');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.sendCode(phone);

      if (response.success) {
        setStep('verify');
        // 开发模式下显示验证码
        if (response.code) {
          setDevCode(response.code);
        }
        // 开始倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.message || '发送验证码失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '发送验证码失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 登录
  const handleLogin = async () => {
    if (!code) {
      setError('请输入验证码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.loginByCode(phone, code);

      if (response.success) {
        onLoginSuccess();
      } else {
        setError(response.message || '登录失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 返回修改手机号
  const handleBack = () => {
    setStep('input');
    setCode('');
    setDevCode(null);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        {/* Logo / 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">DeepKnow Paper</h1>
          <p className="text-gray-600">AI 驱动的论文写作助手</p>
        </div>

        {/* 登录卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 'input' ? (
            // 步骤1: 输入手机号
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">欢迎登录</h2>
                <p className="text-sm text-gray-500">请输入手机号开始使用</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    maxLength={11}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  onClick={handleSendCode}
                  disabled={!isPhoneValid || loading}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                    isPhoneValid && !loading
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      发送中...
                    </>
                  ) : (
                    <>
                      发送验证码
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // 步骤2: 输入验证码
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">请输入验证码</h2>
                <p className="text-sm text-gray-500">
                  已发送至 <span className="font-medium">{phone}</span>
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="请输入6位验证码"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  autoFocus
                />

                {/* 开发模式：显示验证码 */}
                {devCode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                    <p className="text-yellow-800">
                      <span className="font-medium">开发模式验证码：</span>
                      <span className="font-mono text-lg ml-2">{devCode}</span>
                    </p>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    返回
                  </button>
                  <button
                    onClick={handleLogin}
                    disabled={!code || loading}
                    className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                      code && !loading
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        登录中...
                      </>
                    ) : (
                      '登录'
                    )}
                  </button>
                </div>

                {countdown > 0 ? (
                  <p className="text-center text-sm text-gray-500">
                    {countdown} 秒后可重新发送
                  </p>
                ) : (
                  <button
                    onClick={handleSendCode}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    重新发送验证码
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 底部说明 */}
        <p className="text-center text-xs text-gray-500 mt-6">
          登录即表示同意《用户协议》和《隐私政策》
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
