import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
  _id?: string
  name: string
  email: string
  password: string
}

interface IUserModel extends Omit<IUser, '_id'>, Document {}

export enum CustomValidation {
  duplicated = 'duplicated',
  required = 'required'
}

const schema = new mongoose.Schema(
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
  },
);

schema.path('email').validate(async (email: string) => {
  const emailCount = await mongoose.models.User.countDocuments({ email });

  return !emailCount;
}, 'already exists in the database', CustomValidation.duplicated);

export const User: Model<IUserModel> = mongoose.model('User', schema);
