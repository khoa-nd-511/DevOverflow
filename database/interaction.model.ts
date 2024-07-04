import { Document, Schema, model, models, Model } from "mongoose";

export interface IInteractionSchema extends Document {
    user: Schema.Types.ObjectId;
    action: string;
    question: Schema.Types.ObjectId;
    answer: Schema.Types.ObjectId;
    tags: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const InteractionSchema = new Schema<IInteractionSchema>(
    {
        user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        action: { type: String, required: true },
        question: { type: Schema.Types.ObjectId, ref: "Question" },
        answer: { type: Schema.Types.ObjectId, ref: "Answer" },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    },
    { timestamps: true }
);

const InteractionModel: Model<IInteractionSchema> =
    models.Interaction || model("Interaction", InteractionSchema);

export default InteractionModel;
