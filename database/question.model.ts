import { Document, Model, Schema, model, models } from "mongoose";

export interface IQuestionSchema extends Document {
    title: string;
    description: string;
    views: number;
    tags: Schema.Types.ObjectId[];
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    author: Schema.Types.ObjectId;
    answers: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestionSchema>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
        views: { type: Number, default: 0 },
        upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        author: { type: Schema.Types.ObjectId, ref: "User" },
        answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    },
    { timestamps: true }
);

const QuestionModel: Model<IQuestionSchema> =
    models.Question || model("Question", QuestionSchema);

export default QuestionModel;
