import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { promises } from 'readline';
import { RegisterDto } from './dto/register-dto';
import { Users } from 'src/users/users.model';
import Stripe from 'stripe';
@Injectable()
export class AuthService {
  private stripe: Stripe;
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    });
  }

  async loginUser(loginDto: LoginDto): Promise<any> {
    let { userName, password }: any = loginDto;
    const users = await this.prismaService.user.findUnique({
      where: { userName: userName },
    });

    if (!users) {
      throw new NotFoundException('User not found');
    }

    const validatePassword = await bcrypt.compare(password, users.password);
    if (!validatePassword) {
      throw new NotFoundException('Invalid password');
    }
    delete users.password;
    return {
      token: this.jwtService.sign({ userName }),
      user: users,
    };
  }

  async register(createDto: any): Promise<any> {
    const genUser: any = new Users();
    genUser.name = createDto.name;
    genUser.password = await bcrypt.hash(createDto.password, 10);
    genUser.userName = createDto.userName;
    genUser.email = createDto.email;

    const customer = await this.stripe.customers.create(
      {
        email: createDto.email,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      },
    );

    genUser.customerStripeId = customer.id;

    const user = await this.userService.createUser(genUser);

    return {
      token: this.jwtService.sign({ username: user.userName }),
    };
  }
}
