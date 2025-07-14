export interface TokenPayload {
  userId: string;
  email?: string;
  role?: string;
}

export interface ITokenGenerator {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
} 