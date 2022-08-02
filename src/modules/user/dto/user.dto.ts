export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly tel: number;
}

export interface RegisterUserDto {
  readonly accountName: string;
  readonly realName: string;
  readonly password: string;
  readonly repassword: string;
  readonly mobile: number;
}
