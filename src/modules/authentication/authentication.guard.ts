import {
    CanActivate, ExecutionContext, Injectable, UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common'; import { JwtService } from '@nestjs/jwt';
import { ENCRYPTION_KEY } from 'src/config/env.config';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const { authorization }: any = request.headers;
            if (!authorization || authorization.trim() === '') {
                throw new UnauthorizedException('Please provide session token');
            }
            const authToken = authorization.replace(/bearer/gim, '').trim();
            const resp = this.jwtService.verify(authToken, {
                secret: ENCRYPTION_KEY
            }) as { userId: String }
            request.decodedData = resp;
            return true;
        } catch (error) {
            console.log('auth error - ', error.message);
            throw new ForbiddenException(error.message || 'Session expired! Please login');
        }
    }
}