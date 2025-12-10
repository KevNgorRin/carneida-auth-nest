import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Index, ManyToOne } from 'typeorm'

import { BaseEntity } from '@/entities/base.entity'
import { Session } from '@/entities/session.entity'

@Entity({ name: 'carneida_auth_session_users' })
export class SessionUser extends BaseEntity {
    @ApiProperty()
    @Index()
    @Column({ unique: true })
    referenceId: string

    @ApiProperty()
    @ManyToOne(() => Session, (session) => session.user)
    sessions: Session[]

    @ApiProperty()
    @Column({ unique: true })
    email: string

    @ApiProperty()
    @Column({ unique: true, nullable: true })
    username: string

    @ApiProperty()
    @Column({ name: 'password_hash' })
    passwordHash: string

    @ApiProperty()
    @Column({ name: 'is_active', default: true })
    isActive: boolean
}
