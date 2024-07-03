"use server";

import { revalidatePath } from "next/cache";
import AnswerModel from "@/database/answer.model";
import QuestionModel from "@/database/question.model";

import { ICreateAnswerParams } from "./shared.types";
import { connectToDB } from "../mongoose";

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

        answer.save();

        revalidatePath(pathname);
    } catch (error) {
        console.error("unable to create error", error);
        throw error;
    }
}
