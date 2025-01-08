import { UserJWTInterface } from '../user/user.types';

export interface LoginResponseInterface {
  accessToken: string;
  user: UserJWTInterface;
}

export interface LoginBodyInterface {
  email: string;
  password: string;
}

export interface ForgotPasswordResponseInterface {
  message: string;
}

export interface ForgotPasswordBodyInterface {
  email: string;
}

export interface ResetPasswordResponseInterface {
  message: string;
}

export interface ResetPasswordBodyInterface {
  password: string;
  confirmPassword: string;
}
