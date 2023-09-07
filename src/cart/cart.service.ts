import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCartItemDto } from './dto/CreateCartItemDto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async addToCart(userId: string, cartData: CreateCartItemDto) {
    return await this.prismaService.cart.create({
      data: {
        userId,
        productId: cartData.productId,
        quantity: cartData.quantity,
      },
    });
  }

  async getCartItems(userId: string) {
    return await this.prismaService.cart.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
        user: true,
      },
    });
  }

  async deleteCartItem(id: string) {
    let cartItem = await this.prismaService.cart.delete({
      where: { id },
    });
    return cartItem;
  }
}
