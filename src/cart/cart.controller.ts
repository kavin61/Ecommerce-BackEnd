import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/CreateCartItemDto';
import { Request, Response } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId/add')
  async addToCart(
    @Param('userId') userId: string,
    @Body() cartData: CreateCartItemDto,
  ): Promise<any> {
    return await this.cartService.addToCart(userId, cartData);
  }

  @Get(':userId')
  async getCartItems(@Param('userId') userId: string) {
    return await this.cartService.getCartItems(userId);
  }

  @Delete(':id')
  async deleteCartItem(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      let res = await this.cartService.deleteCartItem(id);
      return response.status(200).json({
        status: 'Ok!',
        message: 'deleted successfully',
        result: res,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
