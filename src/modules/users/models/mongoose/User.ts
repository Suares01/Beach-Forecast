import mongoose, { Document, Model } from "mongoose";

import { AuthService } from "@services/Auth";
import logger from "@shared/logger";

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
}

interface IUserModel extends Omit<IUser, "id">, Document {}

export enum CustomValidation {
  duplicated = "duplicated",
  required = "required",
}

const schema = new mongoose.Schema<IUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schema.path("email").validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });

    return !emailCount;
  },
  "already exists in the database",
  CustomValidation.duplicated
);

schema.pre<IUserModel>("save", async function (): Promise<void> {
  if (!this.password || !this.isModified("password")) {
    return;
  }

  try {
    const hashedPass = await AuthService.hashPassword(this.password);

    this.password = hashedPass;
  } catch (err) {
    logger.error(`Error hashing the password for the user ${this.name}`);
  }
});

export const User: Model<IUserModel> = mongoose.model("User", schema);
