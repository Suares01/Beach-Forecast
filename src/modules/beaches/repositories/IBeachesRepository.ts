import { FindBeachData, SaveBeachData } from "../dtos";
import { IBeach } from "../models/mongoose/Beach";

interface IBeachesRepository {
  save(data: SaveBeachData): Promise<IBeach>;
  find(data: FindBeachData): Promise<IBeach[]>;
}

export { IBeachesRepository };
