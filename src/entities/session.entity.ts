import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '@/entities/base.entity'
import { SessionUser } from '@/entities/user.entity'

@Entity({ name: 'carneida_auth_sessions' })
export class Session extends BaseEntity {
    @ApiProperty()
    @ManyToOne(() => SessionUser, (user) => user.sessions)
    @JoinColumn()
    user: SessionUser

    @ApiProperty()
    @Column({ name: 'refresh_token' })
    refreshToken: string

    @ApiProperty()
    @Column({ name: 'access_token' })
    accessToken: string

    @ApiProperty()
    @Column({ name: 'user_agent', nullable: true })
    userAgent: string

    @ApiProperty()
    @Column({ nullable: true })
    ip: string
}
