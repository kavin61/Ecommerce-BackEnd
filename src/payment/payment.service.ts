// stripe.service.ts
import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class paymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    });
  }

  async createCheckoutSession(data: any) {
    const line_items = data.cartItems.map((item) => {
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.product.title,
            images: [item.product.picture],
            metadata: {
              id: item.product.id,
            },
          },
          unit_amount: item.product.actualPrice * 100,
        },
        quantity: 1,
      };
    });
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: { allowed_countries: ['IN'] },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 0, currency: 'inr' },
              display_name: 'free shipping',
              delivery_estimate: {
                minimum: { unit: 'day', value: 2 },
                maximum: { unit: 'day', value: 4 },
              },
            },
          },
        ],
        phone_number_collection: {
          enabled: true,
        },
        line_items,
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:4242/cancel',
      });

      return session;
    } catch (error) {
      throw new Error('Error creating checkout session: ' + error.message);
    }
  }
}
