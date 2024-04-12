import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'

import { SignupDto, SigninDto } from './dto';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, 
        private jwtService: JwtService,
        private config: ConfigService) {}
    
    async signup(dto: SignupDto): Promise<Tokens> {
        const hash = await argon.hash(dto.password);

        const newUser = await this.prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hash,
                role: "Admin"
            }
        })
        .catch((error) => {
            if (error instanceof PrismaClientKnownRequestError) {
              if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials incorrect');
              }
            }
            throw error;
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);

        return tokens;
    }

    async signin(dto: SigninDto): Promise<Tokens>{
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (!user) throw new ForbiddenException('Access Denied');

        const pwMatches = await argon.verify(
            user.password, 
            dto.password,
        );
        if(!pwMatches)
            throw new ForbiddenException(
                'Access Denied',
            )
        
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async logout(userId: number): Promise<boolean> {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null,
                }
            },
            data: {
                hashedRt: null
            }
        });

        return true;
    }

    async refreshTokens(userId: number, rt: string): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

        const rtMatches = await argon.verify(user.hashedRt, rt);
        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async updateRtHash(userId: number, rt: string): Promise<void> {
        const hash = await argon.hash(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRt: hash
            }
        })
    }

    async getTokens(userId: number, email: string): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            sub: userId,
            email: email,
        };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                jwtPayload, {
                    secret: this.config.get<string>('AT_SECRET'),
                    expiresIn: '15m'
                }
            ),
            this.jwtService.signAsync(
                jwtPayload, {
                    secret: this.config.get<string>('RT_SECRET'),
                    expiresIn: '7d',
                }
            ),
        ]);

        return {
            access_token: at,
            refresh_token: rt
        }
    }
}