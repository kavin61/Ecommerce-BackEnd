import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { paymentService } from './payment.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PaymentController],
  providers: [paymentService, PrismaService],
})
export class PaymentModule {}
