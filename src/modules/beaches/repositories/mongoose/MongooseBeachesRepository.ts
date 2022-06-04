import { FindBeachData, SaveBeachData } from "@modules/beaches/dtos";
import { IBeach, Beach } from "@modules/beaches/models/mongoose/Beach";

import { IBeachesRepository } from "../IBeachesRepository";

export class MongooseBeachesRepository implements IBeachesRepository {
  public async save(data: SaveBeachData): Promise<IBeach> {
    const user = new Beach(data);

    await user.save();

    return user;
  }

  public async find({ id, userId: user }: FindBeachData): Promise<IBeach[]> {
    const beaches = await Beach.find({
      ...((user && { user }) || (id && { id })),
    });

    return beaches;
  }
}
