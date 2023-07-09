import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/config/database/database.module';
import { CourseModule } from './modules/course/course.module';
import { CloudModule } from './modules/config/cloud/cloud.module';
import { JwtStrategy } from './shared/auth/providers/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ScopeGuard } from './shared/auth/providers/guards/scope.guard';

@Module({
  imports: [
    DatabaseModule,
    CourseModule,
    CloudModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AppController],
  providers: [JwtStrategy, ScopeGuard],
})
export class AppModule {}
