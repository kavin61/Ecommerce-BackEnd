import { Body, Controller, Post, Get } from '@nestjs/common';
import { paymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: paymentService) {}
    

  
  @Post('intent')
  async createPaymentIntent(@Body() data: any) {
    try {
      const paymentIntent =
        await this.paymentService.createCheckoutSession(data);
      return { clientSecret: paymentIntent };
    } catch (error) {
      console.log(error);
    }
  } 



}
