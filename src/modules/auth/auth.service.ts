import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { Hash, createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: any) {
    const hash = createHash('sha256');
    const hashedPassword = hash.update(userData.password).digest('hex');

    const user = await this.prisma.usuario.create({
      data: {
        ...userData,
        password: hashedPassword,
        estado_validacion: 'pendiente',
        token_validacion: this.generateValidationToken(),
      },
    });
    // Enviar email de validación
    return user;
  }

  async login(email: string, password: string) {
    const hash = createHash('sha256');
    const hashedPassword = hash.update(password).digest('hex');
    const user = await this.prisma.usuario.findUnique({
      where: { email, password: hashedPassword },
    });
    if (user) {
      return {
        access_token: this.jwtService.sign({ userId: user.id }),
      };
    }
    throw new Error('Invalid credentials');
  }

  generateValidationToken() {
    return Math.random().toString(36).substring(2);
  }
}
