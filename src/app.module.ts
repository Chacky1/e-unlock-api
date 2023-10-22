import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { JwtStrategy } from './shared/auth/providers/strategies/jwt.strategy';
import { ScopeGuard } from './shared/auth/providers/guards/scope.guard';
import { DatabaseModule } from './modules/config/database/database.module';
import { CourseModule } from './modules/course/course.module';
import { CloudModule } from './modules/config/cloud/cloud.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    CloudModule,
    CourseModule,
    UserModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy, ScopeGuard],
})
export class AppModule {}
