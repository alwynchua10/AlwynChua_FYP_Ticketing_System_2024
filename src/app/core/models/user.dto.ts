export interface UserDto {
  userID?: number;
  userName: string;
  userEmail: string;
  passwordHash?: string;
  roleID: number | null;
  roleName?: string;
}

export interface LoginDto {
  userEmail: string;
  passwordHash: string;
}
