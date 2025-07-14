import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TaskStatus } from '../../domain/enums/TaskStatus';

export class UpdateTaskDTO {
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsOptional()
      title?: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
      description?: string;

  @IsEnum(TaskStatus, { message: 'El estado debe ser PENDING o COMPLETED' })
  @IsOptional()
      status?: TaskStatus;
} 