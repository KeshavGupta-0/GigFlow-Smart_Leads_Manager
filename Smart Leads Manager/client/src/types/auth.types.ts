export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales_user';
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}
