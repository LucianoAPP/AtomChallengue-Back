import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { ITokenGenerator, TokenPayload } from '../../domain/services/ITokenGenerator';

@injectable()
export class JWTTokenGenerator implements ITokenGenerator {
    private readonly secret = process.env.JWT_SECRET || 'your-secret-key';
    private readonly expiresIn = '24h';

    generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.secret, {
            expiresIn: this.expiresIn,
        });
    }

    verifyToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.secret) as TokenPayload;
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
} 