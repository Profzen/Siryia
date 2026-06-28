import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@siryia.com',
    description: 'Adresse email ou numéro de téléphone',
  })
  @IsNotEmpty({ message: 'L\'identifiant est requis' })
  @IsString()
  identifier!: string;

  @ApiProperty({
    example: 'S3cur3P@ssw0rd!',
    description: 'Mot de passe (minimum 8 caractères)',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  password!: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Nom complet' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@siryia.com' })
  @IsNotEmpty({ message: 'L\'identifiant est requis' })
  @IsString()
  identifier!: string;

  @ApiProperty({ example: 'S3cur3P@ssw0rd!' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password!: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'Artisan menuisier' })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiPropertyOptional({ example: 'Artisan menuisier' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: '+22890000000' })
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  bio?: string;
}

