import AnswerModel from "@/database/answer.model";
import { connectToDB } from "../mongoose";
import { ICreateAnswerParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import QuestionModel from "@/database/question.model";

export async function createAnswer(params: ICreateAnswerParams) {
    try {
        await connectToDB();

        const { author, content, pathname, question } = params;

        const answer = new AnswerModel({
            content,
            author,
            question,
        });

        await QuestionModel.findByIdAndUpdate(question, {
            $push: { answers: answer._id },
        });

        revalidatePath(pathname);
    } catch (error) {
        console.error("unable to create error", error);
        throw error;
    }
}
