export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  role: 'ADMIN' | 'USER';
  active: boolean;
  token?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
