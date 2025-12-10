import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { CARNEIDA_OPTIONS } from '@/constants/config.constants'
import { AuthController } from '@/controllers/auth.controller'
import { DatabaseModule } from '@/database/database.module'
import { SessionsService } from '@/services/sessions.service'
import { GeneratePasswordHashUseCase } from '@/use-cases/generate-password-hash.use-case'
import { LogInWithCredentialsUseCase } from '@/use-cases/login-with-credentials.use-case'
import { RefreshTokenUseCase } from '@/use-cases/refresh-token.use-case'
import { RegisterUserUseCase } from '@/use-cases/register-user.use-case'
import { ValidatePasswordUseCase } from '@/use-cases/validate-password.use-case'

export interface CarneidaAuthModuleOptions {
    customControllers?: ModuleMetadata['controllers']
    customServices?: ModuleMetadata['providers']
    NODE_ENV: string
    JWT_SECRET: string
}

@Module({})
export class CarneidaAuthModule {
    static forRoot(options: CarneidaAuthModuleOptions): DynamicModule {
        return {
            module: CarneidaAuthModule,
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
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
