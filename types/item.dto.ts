export interface CreateItemDto {
  name: string;
  code: string;
  isDisabled?: boolean;
}

export interface UpdateItemDto extends Partial<CreateItemDto> {
  status?: boolean;
}
