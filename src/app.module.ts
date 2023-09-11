import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authentication/auth.module';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [BookModule, UsersModule, AuthModule, CartModule, PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
