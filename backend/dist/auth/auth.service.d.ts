import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private prisma;
    private jwt;
    private usersService;
    constructor(prisma: PrismaService, jwt: JwtService, usersService: UsersService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            name: string;
            photoUrl: string | null | undefined;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            name: string;
            photoUrl: string | null | undefined;
        };
    }>;
    signToken(userId: string, email: string, role: string, name: string, photoUrl?: string | null): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            name: string;
            photoUrl: string | null | undefined;
        };
    }>;
}
