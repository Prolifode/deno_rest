export interface CreateProductDto {
  name: string;
  code: string;
  cost: number;
  price: number;
  organization: string;
  isDisabled?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  status?: boolean;
}
