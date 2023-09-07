import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/authentication/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const res = await this.userService.getAllUser();
      return response.status(200).json({
        status: 'ok',
        message: 'Data fetched successfully',
        result: res,
      });
    } catch (error) {
      return response.status(500).json({
        status: '!ok',
        message: 'Internal server error',
      });
    }
  }
}
