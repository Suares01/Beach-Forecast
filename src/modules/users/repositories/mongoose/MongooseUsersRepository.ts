import { FindUserData, SaveUserData } from "@modules/users/dtos";
import { IUser, User } from "@modules/users/models/mongoose/User";

import { IUsersRepository } from "../IUsersRepository";

export class MongooseUsersRepository implements IUsersRepository {
  public async save(data: SaveUserData): Promise<IUser> {
    const user = new User(data);

    await user.save();

    return user;
  }

  public async findOne({
    email,
    name,
    id,
  }: FindUserData): Promise<IUser | null> {
    const user = await User.findOne({
      ...((email && { email }) || (id && { id }) || (name && { name })),
    });

    return user || null;
  }
}
