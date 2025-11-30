import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CARNEIDA_OPTIONS } from '@/constants/config.constants'
import { AuthController } from '@/controllers/auth.controller'
import { DatabaseModule } from '@/database/database.module'
import { getTypeOrmConfig, TypeORMOptions } from '@/database/typeorm.config'
import { SessionsService } from '@/services/sessions.service'
import { GeneratePasswordHashUseCase } from '@/use-cases/generate-password-hash.use-case'
import { LogInWithCredentialsUseCase } from '@/use-cases/login-with-credentials.use-case'
import { RefreshTokenUseCase } from '@/use-cases/refresh-token.use-case'
import { RegisterUserUseCase } from '@/use-cases/register-user.use-case'
import { ValidatePasswordUseCase } from '@/use-cases/validate-password.use-case'

export interface CarneidaModuleOptions extends TypeORMOptions {
    customControllers?: ModuleMetadata['controllers']
    customServices?: ModuleMetadata['providers']
    NODE_ENV: string
    JWT_SECRET: string
}

@Module({})
export class CarneidaModule {
    static forRoot(options: CarneidaModuleOptions): DynamicModule {
        return {
            module: CarneidaModule,
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                TypeOrmModule.forRoot(getTypeOrmConfig(options)),
                JwtModule,
                DatabaseModule,
            ],
            controllers: options?.customControllers ?? [AuthController],
            providers: [
                {
                    provide: CARNEIDA_OPTIONS,
                    useValue: options,
                },
                SessionsService,
                GeneratePasswordHashUseCase,
                LogInWithCredentialsUseCase,
                RefreshTokenUseCase,
                RegisterUserUseCase,
                ValidatePasswordUseCase,
                ...(options?.customServices ?? []),
            ],
            exports: [SessionsService, RegisterUserUseCase],
        }
    }
}
