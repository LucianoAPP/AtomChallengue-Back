import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDTO {
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
      email!: string;
} 