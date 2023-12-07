import { UserInput } from "../models/auth/user.model";

declare module "express" {
  export interface Request {
    user: UserInput;
  }
}
