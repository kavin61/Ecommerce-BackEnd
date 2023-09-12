import { Body, Controller, Post, Get, Req, Res } from '@nestjs/common';
import { paymentService } from './payment.service';
import { Request, Response } from 'express';
import { Stripe } from 'stripe';
import * as express from 'express';
import * as raw from 'raw-body';

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

  @Post('webhook')
  async handleWebhookEvent(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.body;
    // console.log(rawBody.type);
    try {
      if (rawBody.type === 'checkout.session.completed') {
        this.stripe.customers
          .retrieve(rawBody.data.object.customer)
          .then((customer) => {
            console.log(customer, rawBody.data.object);
          });
      }
      res.status(200).send('Webhook Received: Success');
    } catch (error) {
      console.error('Webhook Error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
