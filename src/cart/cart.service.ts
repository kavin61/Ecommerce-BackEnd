import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCartItemDto } from './dto/CreateCartItemDto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async deleteCartItemById(id: any) {
    let res = await this.prismaService.updateCart.delete({
      where: { id },
    });
    return res;
  }

  async getUpdateCartById(userId: string) {
    let res = await this.prismaService.updateCart.findMany({
      where: {
        userId: userId,
      },
    });
    return res;
  }

  async updateCart(data: any, userId: any) {
    let res: any = await this.prismaService.updateCart.create({
      data: {
        userId: userId,
        title: data.title,
        author: data.author,
        description: data.description,
        picture: data.picture,
        rating: data.rating,
        stock: data.stock,
        actualPrice: data.actualPrice,
        discountedPercent: data.discountedPercent,
        TotalPages: data.TotalPages,
        productId: data.id,
      },
    });

    return res;
  }

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
