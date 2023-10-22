import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

const { AUTH0_DOMAIN, AUTH0_AUDIENCE, AUTH0_ALGORITHM } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const auth0Domain = configService.get<string>('AUTH0_DOMAIN');
    const auth0Audience = configService.get<string>('AUTH0_AUDIENCE');
    const auth0Algorithm = configService.get<string>('AUTH0_ALGORITHM');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        const client = jwksRsa({
          jwksUri: new URL('.well-known/jwks.json', auth0Domain).toString(),
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
      audience: auth0Audience,
      issuer: auth0Domain,
      algorithms: [auth0Algorithm],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
