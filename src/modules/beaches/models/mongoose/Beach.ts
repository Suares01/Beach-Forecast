import mongoose, { Document, Model, Schema } from "mongoose";

export enum Position {
  south = "S",
  east = "E",
  west = "W",
  north = "N",
}

export interface IBeach {
  id?: string;
  lat: number;
  lng: number;
  name: string;
  position: Position;
  user: string;
}

interface IBeachModel extends Omit<IBeach, "id">, Document {}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
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

export const Beach: Model<IBeachModel> = mongoose.model("Beach", schema);
