import { Document, Schema, model, models, Model } from "mongoose";

export interface ITagSchema extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITagSchema>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const TagModel: Model<ITagSchema> = models.Tag || model("Tag", TagSchema);

export default TagModel;
