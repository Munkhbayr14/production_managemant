import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/common/constants/enum.const';

export class CreateUserDto {

    @IsEmail()
    email?: string;

    @IsString()
    phone?: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    lastName?: string;

    @IsEnum(UserRole, { message: 'Буруу эрх сонгосон байна' })
    @IsNotEmpty({ message: 'Хэрэглэгчийн эрх сонгоно уу' })
    role?: UserRole;
}