import { IBeach } from "../models/mongoose/Beach";

type SaveBeachData = Omit<IBeach, "id">;

type FindBeachData = {
  id?: string;
  userId?: string;
};

export { SaveBeachData, FindBeachData };
