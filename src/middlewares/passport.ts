import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt';
import User from '../model/User';
import { Types } from 'mongoose';

interface IJwtPayload {
  id: string;
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export default new JwtStrategy(
  opts,
  async (jwt_payload: IJwtPayload, done: VerifiedCallback) => {
    const user = await User.getModel()
      .findOne({ _id: new Types.ObjectId(jwt_payload.id) })
      .lean();
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  },
);
