import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/config/database/database.module';
import { CourseModule } from './modules/course/course.module';
import { CloudModule } from './modules/config/cloud/cloud.module';

@Module({
  imports: [DatabaseModule, CourseModule, CloudModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
