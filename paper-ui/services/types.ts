/**
 * 认证相关类型定义
 */

// 用户信息
export interface UserDTO {
  id: number;
  phone: string;
  username: string;
  nickname: string | null;
  avatar: string | null;
  email: string | null;
  enabled: boolean;
  createdAt: string;
  lastLoginAt: string;
}

// 发送验证码请求
export interface SendCodeRequest {
  phone: string;
}

// 发送验证码响应
export interface SendCodeResponse {
  success: boolean;
  message: string;
  code?: string; // 开发模式下返回
  lockUntil?: number;
}

// 验证码登录请求
export interface LoginByCodeRequest {
  phone: string;
  code: string;
}

// 登录响应
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: UserDTO;
  tempToken?: string; // 实际存储的是 JWT token
  lockUntil?: number;
}

// 通用 API 响应包装
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 本地存储的认证信息
export interface AuthState {
  token: string;
  user: UserDTO;
}
