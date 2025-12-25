/**
 * 认证相关类型定义
 */

// 用户信息
export interface UserDTO {
  id: number;
  phone?: string;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  enabled?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  isGuest?: boolean;  // 是否为访客
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
  tempToken?: string; // JWT token
  lockUntil?: number;
}

// 本地存储的认证状态
export interface AuthState {
  token: string;
  user: UserDTO;
}
