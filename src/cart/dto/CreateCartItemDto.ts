export class CreateCartItemDto {
  productId: string;
  quantity: number;
}

export class CartDto {
  id: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
