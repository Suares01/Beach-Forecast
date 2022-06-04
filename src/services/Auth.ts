import { compare, hash } from "bcrypt";
import config from "config";
import { sign, verify } from "jsonwebtoken";

import { IAuth } from "@config/types/configTypes";
import { IUser } from "@modules/users/models/mongoose/User";

export type DecodedUser = Omit<IUser, "password">;

export class AuthService {
  private static authConfig = config.get<IAuth>("App.auth");

  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    const encryptedPass = await hash(password, salt);

    return encryptedPass;
  }

  public static async comparePassword(
    password: string,
    hashedPass: string
  ): Promise<boolean> {
    const comparePass = await compare(password, hashedPass);

    return comparePass;
  }

  public static generateToken(payload: object): string {
    const token = sign(payload, this.authConfig.secret, {
      expiresIn: "1d",
    });

    return token;
  }

  public static decodeToken(token: string): DecodedUser {
    const userInfo = verify(token, this.authConfig.secret) as DecodedUser;

    return userInfo;
  }
}
