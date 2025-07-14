import { v4 as uuidv4 } from 'uuid';

export class TaskId {
    private readonly value: string;

    constructor(value?: string) {
        this.value = value || uuidv4();
        this.validate();
    }

    private validate(): void {
        if (!this.value || typeof this.value !== 'string') {
            throw new Error('TaskId debe ser una cadena válida');
        }
    }

    toString(): string {
        return this.value;
    }

    equals(other: TaskId): boolean {
        return this.value === other.value;
    }
} 