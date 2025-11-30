import { UUID } from 'crypto'

import { ApiProperty } from '@nestjs/swagger'
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

export class BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @ApiProperty()
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: string

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: string
}
