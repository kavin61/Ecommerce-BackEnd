import { Body, Controller, Post, Get, Req, Res, Param } from '@nestjs/common';
import { paymentService } from './payment.service';
import { Request, Response } from 'express';
import { Stripe } from 'stripe';

@Controller('payment')
export class PaymentController {
  private stripe: Stripe;
  constructor(private readonly paymentService: paymentService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    });
  }

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

  @Post('subscription')
  async createSubscription(@Body() data: any) {
    try {
      const sub = await this.paymentService.userSubscribe(data);
      return sub;
    } catch (error) {}
  }

  @Post('webhook')
  async handleWebhookEvent(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.body;

    try {
      if (rawBody.type === 'checkout.session.completed') {
        this.stripe.customers
          .retrieve(rawBody.data.object.customer)
          .then(async (customer) => {
            let res = await this.paymentService.createOrder(
              customer,
              rawBody.data.object,
            );
          });
      }
      res.status(200).send('Webhook Received: Success');
    } catch (error) {
      console.error('Webhook Error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }

  @Get('prices')
  async getPrices() {
    return this.paymentService.getPrices();
  }

  @Get('subs/:subs')
  async subscribtionDetails(@Param('subs') subs: string) {
    try {
      return this.paymentService.subscribtionDetails(subs);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('plan/:id')
  async getMyCurrentPlan(@Param('id') id: string) {
    try {
      return this.paymentService.getMyPlan(id);
    } catch (error) {}
  }
}
