import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { identifier, password, name } = registerDto;
    const isEmail = identifier.includes('@');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersService.findByIdentifier(identifier);
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet identifiant existe déjà');
    }

    // Hacher le mot de passe avec Argon2id
    const hashedPassword = await argon2.hash(password);
    
    let profileData = undefined;
    if (name) {
      const parts = name.split(' ');
      profileData = {
        create: {
          firstName: parts[0],
          lastName: parts.slice(1).join(' ') || '',
        }
      };
    }

    // Créer l'utilisateur
    const user = await this.usersService.create({
      ...(isEmail ? { email: identifier } : { phone: identifier }),
      passwordHash: hashedPassword,
      profile: profileData,
    });

    return this.generateToken(user.id, identifier);
  }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    // Trouver l'utilisateur
    const user = await this.usersService.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await argon2.verify(user.passwordHash as string, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return this.generateToken(user.id, identifier);
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
