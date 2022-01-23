import mongoose, { Document, Model } from "mongoose";

export enum BeachPosition {
  south = "S",
  east = "E",
  west = "W",
  north = "N",
}

export interface IBeach {
  _id?: string;
  lat: number;
  lng: number;
  name: string;
  position: BeachPosition;
}

interface IBeachModel extends Omit<IBeach, "_id">, Document {}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
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
