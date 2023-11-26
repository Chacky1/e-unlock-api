import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './providers/services/user.service';
import { UserRepository } from './providers/repositories/user.repository';
import { DatabaseModule } from '../config/database/database.module';
import { CourseService } from '../course/providers/services/course.service';
import { CourseRepository } from '../course/providers/repositories/course.repository';
import { CloudModule } from '../config/cloud/cloud.module';
import { UserWebhookController } from './controllers/webhook.controller';
import { LessonService } from '../course/providers/services/lesson.service';
import { LessonRepository } from '../course/providers/repositories/lesson.repository';
import { ActionService } from '../course/providers/services/action.service';
import { ActionRepository } from '../course/providers/repositories/action.repository';

@Module({
  imports: [DatabaseModule, CloudModule],
  controllers: [UserController, UserWebhookController],
  providers: [
    UserService,
    UserRepository,
    CourseService,
    CourseRepository,
    LessonService,
    LessonRepository,
    ActionService,
    ActionRepository,
  ],
})
export class UserModule {}
