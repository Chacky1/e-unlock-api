import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

const { AUTH0_DOMAIN, AUTH0_AUDIENCE, AUTH0_ALGORITHM } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        const client = jwksRsa({
          jwksUri: new URL('/.well-known/jwks.json', AUTH0_DOMAIN).toString(),
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
        });

        const header = JSON.parse(
          Buffer.from(rawJwtToken.split('.')[0], 'base64').toString(),
        );
        client.getSigningKey(header.kid, (err, key) => {
          if (err) {
            done(err, null);
          } else {
            done(null, key.getPublicKey());
          }
        });
      },
      audience: AUTH0_AUDIENCE,
      issuer: AUTH0_DOMAIN,
      algorithms: [AUTH0_ALGORITHM],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
