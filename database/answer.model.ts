import { Document, Model, Schema, model, models } from "mongoose";

export interface IAnswerSchema extends Document {
    content: string;
    author: Schema.Types.ObjectId;
    question: Schema.Types.ObjectId;
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    created: Date;
    updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswerSchema>(
    {
        content: { type: String, required: true, minlength: 100 },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        question: {
            type: Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const AnswerModel: Model<IAnswerSchema> =
    models.Answer || model<IAnswerSchema>("Answer", AnswerSchema);

export default AnswerModel;
