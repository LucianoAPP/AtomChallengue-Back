export abstract class DomainError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly statusCode: number = 400
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends DomainError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
    }
}

export class NotFoundError extends DomainError {
    constructor(entity: string, id: string) {
        super(`${entity} con ID ${id} no encontrado`, 'NOT_FOUND_ERROR', 404);
    }
}

export class AuthenticationError extends DomainError {
    constructor(message = 'Error de autenticación') {
        super(message, 'AUTHENTICATION_ERROR', 401);
    }
}

export class AuthorizationError extends DomainError {
    constructor(message = 'Error de autorización') {
        super(message, 'AUTHORIZATION_ERROR', 403);
    }
}

export class ConflictError extends DomainError {
    constructor(message: string) {
        super(message, 'CONFLICT_ERROR', 409);
    }
} 