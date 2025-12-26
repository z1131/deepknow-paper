/**
 * 认证服务
 * 处理登录、登出、发送验证码等操作
 */
import axiosInstance, { tokenManager } from './axios';
import axios from 'axios';
import { getApiUrl } from './config';
import type {
  SendCodeResponse,
  LoginResponse,
  UserDTO,
} from './types';

// 直接使用 fetch 避免未登录时触发拦截器
const authAxios = axios.create({
  baseURL: getApiUrl(''),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  /**
   * 访客登录
   */
  async guestLogin(): Promise<LoginResponse> {
    try {
      const response = await authAxios.post<LoginResponse>('/auth/guest-login');
      const result = response.data;

      // 登录成功，保存 token 和用户信息
      if (result.success && result.user && result.tempToken) {
        tokenManager.setToken(result.tempToken);
        tokenManager.setUser(result.user);
      }

      return result;
    } catch (error) {
      console.error('访客登录失败:', error);
      throw error;
    }
  },

  /**
   * 发送短信验证码
   */
  async sendCode(phone: string): Promise<SendCodeResponse> {
    try {
      const response = await authAxios.post<SendCodeResponse>(
        '/auth/send-code',
        { phone }
      );
      return response.data;
    } catch (error) {
      console.error('发送验证码失败:', error);
      throw error;
    }
  },

  /**
   * 验证码登录
   */
  async loginByCode(phone: string, code: string): Promise<LoginResponse> {
    try {
      const response = await authAxios.post<LoginResponse>(
        '/auth/login-by-code',
        { phone, code }
      );

      const result = response.data;

      // 登录成功，保存 token 和用户信息
      if (result.success && result.user && result.tempToken) {
        tokenManager.setToken(result.tempToken);
        tokenManager.setUser(result.user);
      }

      return result;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  /**
   * 登出
   */
  logout(): void {
    tokenManager.clear();
    // 触发登出事件
    window.dispatchEvent(new CustomEvent('auth:logout'));
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): UserDTO | null {
    return tokenManager.getUser();
  },

  /**
   * 检查是否已登录
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },

  /**
   * 获取 token
   */
  getToken(): string | null {
    return tokenManager.getToken();
  },
};
