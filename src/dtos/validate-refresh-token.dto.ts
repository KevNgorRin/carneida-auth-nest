import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ValidateRefreshTokenDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    refreshToken: string
}
