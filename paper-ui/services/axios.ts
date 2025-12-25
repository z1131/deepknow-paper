/**
 * Axios 实例配置
 * 包含请求/响应拦截器，自动注入 JWT token
 */
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getApiUrl } from './config';

// Token 存储键
const TOKEN_KEY = 'deepknow_token';
const USER_KEY = 'deepknow_user';

/**
 * Token 管理工具
 */
export const tokenManager = {
  // 获取 token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // 保存 token
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // 移除 token
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // 获取用户信息
  getUser(): any {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // 保存用户信息
  setUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // 移除用户信息
  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  // 清除所有认证信息
  clear(): void {
    this.removeToken();
    this.removeUser();
  },

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: getApiUrl(''), // 使用空字符串，因为 getApiUrl 已经包含了完整路径
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动注入 token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理错误
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 处理 401 未授权
    if (error.response?.status === 401) {
      tokenManager.clear();
      // 触发登出事件，让 App 层感知
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    // 处理 403 禁止访问
    if (error.response?.status === 403) {
      console.error('权限不足:', error.config?.url);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
