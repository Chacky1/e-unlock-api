import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/config/database/database.module';
import { CourseModule } from './modules/course/course.module';
import { CloudModule } from './modules/config/cloud/cloud.module';
import { JwtStrategy } from './shared/auth/providers/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ScopeGuard } from './shared/auth/providers/guards/scope.guard';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    CloudModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CourseModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy, ScopeGuard],
})
export class AppModule {}
