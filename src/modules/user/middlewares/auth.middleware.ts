import { UserDocument, UserSchema } from './../models/user.model';
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "../user.service";
import { ENCRYPTION_KEY } from "src/config/env.config";
import { JwtService } from '@nestjs/jwt';

export interface ExpressRequest extends Request {
    user?: UserDocument
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async use(req: ExpressRequest, res: Response, next: NextFunction) {
        if (!req.headers['authorization']) {
            req.user = null
            next()
            return
        }

        const token = req.headers['authorization'].split(' ')[1]

        try {
            const decode = this.jwtService.verify(token, {
                secret: ENCRYPTION_KEY
            }) as { userId: String }
            const user = await this.userService.findUserById(decode.userId)
            req.user = user
            next()
        } catch (err) {
            req.user = null
            next()
        }
    }
}