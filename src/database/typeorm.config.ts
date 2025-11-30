import { TypeOrmModuleOptions } from '@nestjs/typeorm'

import { entities } from '@/database/entities'

export interface TypeORMOptions {
    host: string
    port: number
    database: string
    username: string
    password: string
}

export function getTypeOrmConfig({
    host,
    port,
    database,
    username,
    password,
}: TypeORMOptions): TypeOrmModuleOptions {
    return {
        type: 'postgres',
        host,
        port,
        database,
        username,
        password,
        extra: {
            charset: 'utf8',
        },
        entities,
    }
}
