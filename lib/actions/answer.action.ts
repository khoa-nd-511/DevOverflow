"use server";

import { revalidatePath } from "next/cache";
import AnswerModel from "@/database/answer.model";
import QuestionModel from "@/database/question.model";

import { ICreateAnswerParams, IGetAnswersParams } from "./shared.types";
import { connectToDB } from "../mongoose";
import { IUserSchema } from "@/database/user.model";

export async function getAnswersByQuestionId(params: IGetAnswersParams) {
    try {
        await connectToDB();

        const { questionId } = params;

        const answers = await AnswerModel.find({ question: questionId })
            .sort({
                createdAt: -1,
            })
            .populate<{
                author: Pick<IUserSchema, "_id" | "name" | "picture">;
            }>({ path: "author", select: "_id name picture" });

        return answers;
    } catch (error) {
        console.error("unable to create error", error);
        throw error;
    }
}

export async function createAnswer(params: ICreateAnswerParams) {
    try {
        await connectToDB();

        const { author, content, pathname, question } = params;

        const answer = await AnswerModel.create({
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
