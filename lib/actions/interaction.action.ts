"use server";

import QuestionModel from "@/database/question.model";
import { connectToDB } from "../mongoose";
import { IViewQuestionParams } from "./shared.types";
import InteractionModel from "@/database/interaction.model";

export async function viewQuestion(params: IViewQuestionParams) {
    try {
        await connectToDB();

        const { questionId, userId } = params;

        // update view count for each question
        await QuestionModel.findByIdAndUpdate(questionId, {
            $inc: { views: 1 },
        });

        if (userId) {
            const existingInteraction = await InteractionModel.findOne({
                user: userId,
                action: "view",
                question: questionId,
            });

            if (existingInteraction) {
                // console.log(
                //     "User",
                //     userId,
                //     "has already view this question",
                //     questionId
                // );
                return;
            }

            await InteractionModel.create({
                user: userId,
                question: questionId,
                action: "view",
            });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
