export interface JwtPayload {
  id: string;
  role: "ADMIN" | "USER";
}
