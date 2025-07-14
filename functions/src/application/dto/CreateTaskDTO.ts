import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTaskDTO {
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es requerido' })
      title!: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
      description?: string;
} 