import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUser(): Promise<any> {
    return this.prisma.user.findMany();
  }
  async createUser(data: any): Promise<any> {
    const existing = await this.prisma.user.findUnique({
      where: {
        userName: data.userName,
      },
    });

    if (existing) {
      throw new ConflictException('username already exists');
    }

    return this.prisma.user.create({
      data,
    });
  }
}
