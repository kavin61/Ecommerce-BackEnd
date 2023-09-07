import { PrismaService } from 'src/prisma.service';
import { CreateAuthorDto, CreateBookDto, createProductDto } from './book.Dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async getAllBook() {
    return this.prisma.book.findMany();
  }
 
async getAllProduct(){ 
  return this.prisma.product.findMany()
}


  async getBook(id: number) {
    return this.prisma.book.findUnique({ where: { id: Number(id) } });
  }


  async getProduct(id: string) { 
    return this.prisma.product.findUnique({ where: { id: id } });
  }

  // async createBook(data: Book) {
  //   return this.prisma.book.create({
  //     data: data as Prisma.BookCreateInput,
  //   });
  // }

  async createAuthor(authorData: CreateAuthorDto): Promise<any> {
    return this.prisma.author.create({
      data: authorData,
    });
  }


  async createBook(bookData: CreateBookDto): Promise<any> {
    return this.prisma.book.create({
      data: bookData,
    });
  }


  async createProduct(bookData: any): Promise<any> {
    return this.prisma.product.create({
      data: bookData,
    });
  }


  async getBooksByAuthorName(authorName: string): Promise<any[]> {
    return this.prisma.book.findMany({
      where: {
        author: {
          name: authorName,
        },
      },
    });
  }

  // async createBook(bookData: CreateBookDto): Promise<Book> {
  //   return this.prisma.book.create({
  //     data: bookData,
  //   });
  // }

  // async updateBook(id: number, data: Book) {
  //   return this.prisma.book.update({
  //     where: { id: Number(id) },
  //     data: { title: data.title, description: data.description },
  //   });
  // }

  // async deleteBook(id: number) {
  //   return this.prisma.book.delete({
  //     where: { id: Number(id) },
  //   });
  // }

  // async getBooksByAuthor(author: any) {
  //   return this.prisma.book.findMany({
  //     where: {
  //       author: author,
  //     },
  //   });
  // }
}
