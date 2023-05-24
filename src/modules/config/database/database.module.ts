import { Module } from '@nestjs/common';
import { DatabaseService } from './providers/services/database.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
