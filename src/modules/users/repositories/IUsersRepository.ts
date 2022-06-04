import { FindUserData, SaveUserData } from "../dtos";
import { IUser } from "../models/mongoose/User";

interface IUsersRepository {
  save(data: SaveUserData): Promise<IUser>;

  findOne(data: FindUserData): Promise<IUser | null>;
}

export { IUsersRepository };
