export interface IRegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IJwtPayload {
  userId: string;
  role: 'admin' | 'sales_user';
  email: string;
}
