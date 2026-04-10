import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class AuthLoginDto {
    @ApiProperty()
    @IsOptional()
    email?: string;

    @ApiProperty()
    @IsOptional()
    phone?: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}
