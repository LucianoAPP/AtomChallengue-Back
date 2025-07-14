export class Email {
    private readonly value: string;

    constructor(value: string) {
        this.value = value;
        this.validate();
    }

    private validate(): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.value || !emailRegex.test(this.value)) {
            throw new Error('Email debe tener un formato válido');
        }
    }

    toString(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }
} 