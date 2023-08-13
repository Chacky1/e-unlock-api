import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './providers/services/user.service';
import { UserRepository } from './providers/repositories/user.repository';
import { DatabaseModule } from '../config/database/database.module';
import { CourseService } from '../course/providers/services/course.service';
import { CourseRepository } from '../course/providers/repositories/course.repository';
import { CloudModule } from '../config/cloud/cloud.module';

@Module({
  imports: [DatabaseModule, CloudModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, CourseService, CourseRepository],
})
export class UserModule {}
