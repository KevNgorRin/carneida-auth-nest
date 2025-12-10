import { ApiProperty } from '@nestjs/swagger'

export class PublicSessionTokens {
    @ApiProperty()
    accessToken: string
}
