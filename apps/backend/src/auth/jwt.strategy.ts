import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'default-secret-key-change-it',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // Cette méthode est appelée après que le token a été vérifié
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable ou token invalide');
    }
    
    // On retourne l'objet qui sera injecté dans la requête HTTP (req.user)
    // Nous ne renvoyons que ce dont nous avons besoin, pas le mot de passe !
    return { id: user.id, email: user.email };
  }
}
