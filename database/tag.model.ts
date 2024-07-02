import { Document, Schema, model, models, InferSchemaType } from "mongoose";

interface ITagSchema extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
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

const Tag = models.Tag || model("Tag", TagSchema);

export type ITag = InferSchemaType<typeof TagSchema>;

export default Tag;
