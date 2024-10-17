export interface UserDto {
  UserId?: number;
  UserName: string;
  UserEmail: string;
  Password?: string;
  RoleID: number | null;
}

export interface LoginDto {
  UserEmail: string;
  Password: string;
}
