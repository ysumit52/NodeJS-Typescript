import { FilterQuery, QueryOptions } from 'mongoose';
import { excludedFields } from '../controllers/auth.controller';
import UserModel, { UserDocument, UserInput } from '../models/user.model';
import { omit } from 'lodash';
import { signJwt } from '../utils/jwt';
import config from 'config';
import redisClient from '../utils/connectRedis';

// CreateUser service
export const createUser = async (input: Partial<UserInput>) => {
  const user = await UserModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

//find user by any field
export const findUser = async (
  query: FilterQuery<UserInput>,
  options: QueryOptions = {}
) => {
  return await UserModel.findOne(query, {}, options).select('+password');
};

//find user by id field
export const findUserById = async (id: string) => {
  const user = await UserModel.findById(id).lean();
  return omit(user, excludedFields);
};

export const signToken = async (user: UserDocument) => {
  try {
    const access_token = signJwt({ sub: user._id }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    const refresh_token = signJwt({ sub: user._id }, 'refreshTokenPrivateKey', {
      expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });

    // Create a Session
    await redisClient.set(user._id.valueOf(), JSON.stringify(user), {
      EX: 60 * 60,
    });

    // const keys = await redisClient.sendCommand(['keys', '*']);
    // console.log(keys); // ["aXF","x9U","lOk",...]

    return { access_token, refresh_token };
  } catch (error: unknown) {
    throw new Error(
      `Token Error: ${(error as { message: string })?.message || error}`
    );
  }
};
