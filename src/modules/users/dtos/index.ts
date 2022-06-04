import { IUser } from "../models/mongoose/User";

type SaveUserData = Omit<IUser, "id">;

type FindUserData = Partial<Omit<IUser, "password">>;

export { SaveUserData, FindUserData };
