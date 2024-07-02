import { Document, Model, Schema, model, models } from "mongoose";

export interface IUserSchema extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  location?: string;
  website?: string;
  reputation?: number;
  saved: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUserSchema>(
  {
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    bio: { type: String },
    picture: { type: String, required: true },
    location: { type: String },
    website: { type: String },
    reputation: { type: Number, default: 0 },
    saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

const UserModel: Model<IUserSchema> =
  models.User || model<IUserSchema>("User", UserSchema);

export default UserModel;
