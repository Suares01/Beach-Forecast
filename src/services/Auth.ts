import { compare, hash } from "bcrypt";

export class AuthService {
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
}
