export interface UserDto {
  UserName: string;
  UserEmail: string;
  PasswordHash: string;
  RoleID?: number;
}

export interface LoginDto {
  UserEmail: string;
  Password: string;
}
