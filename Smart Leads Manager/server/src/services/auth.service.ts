import { IRegisterBody, ILoginBody } from '../types/auth.types';
import { findByEmail, createUser } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt.utils';

export const register = async (body: IRegisterBody) => {
  const existingUser = await findByEmail(body.email);
  if (existingUser) {
    throw new ApiError(400, 'Email is already registered');
  }

  const user = await createUser({
    name: body.name,
    email: body.email,
    passwordHash: body.password,
  });

  const payload = { userId: user._id.toString(), role: user.role, email: user.email };
  const token = signToken(payload);

  const userObj = user.toObject();
  delete (userObj as any).passwordHash;

  return { user: userObj, token };
};

export const login = async (body: ILoginBody) => {
  const user = await findByEmail(body.email);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(body.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const payload = { userId: user._id.toString(), role: user.role, email: user.email };
  const token = signToken(payload);

  const userObj = user.toObject();
  delete (userObj as any).passwordHash;

  return { user: userObj, token };
};
