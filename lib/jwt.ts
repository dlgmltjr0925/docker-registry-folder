import jwt, { JwtPayload } from 'jsonwebtoken';

import { GetServerSidePropsContext } from '../interfaces/next';
import { UserDto } from '../src/auth/dto/user.dto';

export const getUserByAccessToken = (accessToken: string): UserDto => {
  try {
    const { sub, username, role, systemAdmin } = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    return { id: parseInt(sub as string), username, role, systemAdmin };
  } catch (error) {
    throw error;
  }
};

export const verifyRefreshToken = (refreshToken: string): boolean => {
  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET as string);
    return true;
  } catch (error) {
    return false;
  }
};

export const getUserByContext = (context: GetServerSidePropsContext): UserDto | null => {
  const { session } = context.req;
  const { accessToken } = session;

  if (!accessToken) return null;
  try {
    return getUserByAccessToken(accessToken);
  } catch (error) {
    console.error(error);
    return null;
  }
};
