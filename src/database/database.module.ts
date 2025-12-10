import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { entities } from '@/database/entities.constants'

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
