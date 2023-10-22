import { Module } from '@nestjs/common';
import { DatabaseModule } from '../config/database/database.module';
import { OrderController } from './controllers/order.controller';
import { OrderRepository } from './providers/repositories/order.repository';
import { OrderService } from './providers/services/order.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
