import {Prisma} from "@prisma/client" 

 
// export class Book implements Prisma.BookCreateInput{ 
//     id ?: Number; 
//     title: string; 
//     description?: string; 
//     author?: string;
// } 

export class CreateAuthorDto {
  name: string;
}
 
export class CreateBookDto {
  title: string;
  description?: string;
  authorId: number;
} 

export class createProductDto {
  id: String;
  title: String;
  author: String;
  description: String;
  picture: String;
  rating: number;
  stock: Boolean;
  actualPrice: number;
  discountedPercent: number;
  TotalPages: number;
}
  



















