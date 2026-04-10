import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from 'src/common/constants/constants.const';
import { Strategy, ExtractJwt } from 'passport-jwt';

export type JwtPayload = {
  sub: string;
  email?: string;
  phone?: string;
  role: 'ADMIN' | 'WAREHOUSE' | 'DRIVER';
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
