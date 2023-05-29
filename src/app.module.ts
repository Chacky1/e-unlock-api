import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/config/database/database.module';
import { CourseModule } from './modules/course/course.module';

@Module({
  imports: [DatabaseModule, CourseModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
