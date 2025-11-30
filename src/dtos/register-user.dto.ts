import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class RegisterUserDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    referenceId: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    password: string
}
