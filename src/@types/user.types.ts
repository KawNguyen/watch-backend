export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRegister {
  email: string;
  password: string;
  fullName: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}
