// stripe.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Stripe } from 'stripe';

@Injectable()
export class paymentService {
  private stripe: Stripe;

  constructor(private prismaService: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    });
  }

  async createCheckoutSession(data: any) {
    let productId = data.cartItems.map((item) => item.product.id);
    let totalPrice = data.cartItems.reduce(
      (acc, curr) => acc + curr.product.actualPrice,
      0,
    );

    const customer = await this.stripe.customers.create({
      metadata: {
        product_id: JSON.stringify(productId),
        user_id: data?.user[0]?.id,
        total_price: totalPrice,
      },
    });

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
        customer: customer.id,
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

  async userSubscribe(userData: any) {
    // const customer = await this.stripe.customers.create(
    //   {
    //     email: userData?.email,
    //   },
    //   {
    //     apiKey: process.env.STRIPE_SECRET_KEY,
    //   },
    // );

    // console.log(customer.id, 'customeriddddddddd');

    // let updaterUserByStripeId = await this.prismaService.user.update({
    //   where: {
    //     id: userData.userId,
    //   },
    //   data: {
    //     customerStripeId: customer.id,
    //   },
    // });

    let user = await this.prismaService.user.findUnique({
      where: {
        id: userData.userId,
      },
    });

    const session = await this.stripe.checkout.sessions.create(
      {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: userData.priceId,
            quantity: 1,
          },
        ],
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:4242/cancel',
        customer: user.customerStripeId,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      },
    );

    const subscription: any = await this.stripe.subscriptions.list(
      {
        customer: user.customerStripeId,
        status: 'all',
        expand: ['data.default_payment_method'],
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      },
    );
    const plan = subscription?.data[0]?.plan?.nickname;

    console.log(plan, 'wwwwwwwwwwww');
    if (plan == 'Standard') {
      let updateUserTier: any = await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          subscriptionPlan: plan,
        },
      });
    } else if (plan == 'Premium') {
      let updateUserTier: any = await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          subscriptionPlan: plan,
        },
      });
    }

    return session;
  }

  async createOrder(customer: any, intent: any) {
    try {
      let orderId = Date.now();
      const orderData: any = {
        intentId: intent.id,
        orderId: orderId.toString(),
        amount: intent.amount_total,
        created: new Date(intent.created * 1000),
        paymentMethodTypes: JSON.stringify(intent.payment_method_types),
        status: intent.payment_status,
        customer: JSON.stringify(intent.customer_details),
        shippingDetails: JSON.stringify(intent.shipping_details),
        userId: customer.metadata.user_id,
        items: JSON.stringify(customer.metadata.product_id),
        total: Number(customer.metadata.total_price),
        sts: 'pending',
      };

      const createdOrder = await this.prismaService.order.create({
        data: orderData,
      });

      return createdOrder;
    } catch (error) {
      console.log(error);
    }
  }

  async getPrices() {
    let res = await this.stripe.prices.list({
      apiKey: process.env.STRIPE_SECRET_KEY,
    });
    return res;
  }
  async subscribtionDetails(id: string) {
    let user: any = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    const subscription: any = await this.stripe.subscriptions.list(
      {
        customer: user.customerStripeId,
        status: 'all',
        expand: ['data.default_payment_method'],
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      },
    );
    const plan = subscription?.data[0]?.plan?.nickname;
    console.log(plan, 'paaaaaaa');
    if (plan == 'Standard') {
      let updateUserTier: any = await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          subscriptionPlan: plan,
        },
      });

      let product = await this.prismaService.product.findMany();
      let discountProduct = product.map((item) => {
        return {
          ...item,
          discountedPercent: 20,
        };
      });
      return discountProduct;
    } else if (plan == 'Premium') {
      let updateUserTier: any = await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          subscriptionPlan: plan,
        },
      });
      let product = await this.prismaService.product.findMany();
      let discountProduct = product.map((item) => {
        return {
          ...item,
          discountedPercent: 30,
        };
      });
      return discountProduct;
    } else {
      let product = await this.prismaService.product.findMany();
      return product;
    }
  }

  async getMyPlan(id: string) {
    console.log(id);
    let userPlan = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    return {
      userPlan: userPlan.subscriptionPlan,
    };
  }
}
