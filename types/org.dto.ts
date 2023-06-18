export interface CreateOrgDto {
  name: string;
  isDisabled?: boolean;
}

export interface UpdateOrgDto extends Partial<CreateOrgDto> {
  status?: boolean;
}
