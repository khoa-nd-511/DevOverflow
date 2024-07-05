"use server";

import { UpdateQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import AnswerModel, { IAnswerSchema } from "@/database/answer.model";
import QuestionModel from "@/database/question.model";

import {
    IAnswerVoteParams,
    ICreateAnswerParams,
    IGetAnswersParams,
    PopulatedUser,
} from "./shared.types";
import { connectToDB } from "../mongoose";

export async function getAnswersByQuestionId(params: IGetAnswersParams) {
    try {
        await connectToDB();

        const { questionId } = params;

        const answers = await AnswerModel.find({ question: questionId })
            .sort({
                createdAt: -1,
            })
            .populate<{
                author: PopulatedUser;
            }>({ path: "author", select: "_id clerkId name picture" });

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

export async function upvoteAnswer(params: IAnswerVoteParams) {
    try {
        await connectToDB();

        const { hasDownvoted, hasUpvoted, pathname, id, userId } = params;

        const updates: UpdateQuery<IAnswerSchema> = {};

        if (hasUpvoted) {
            updates.$pull = { upvotes: userId };
        } else if (hasDownvoted) {
            updates.$push = { upvotes: userId };
            updates.$pull = { downvotes: userId };
        } else {
            updates.$addToSet = { upvotes: userId };
        }

        const answer = await AnswerModel.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!answer) throw new Error("Answer not found");

        revalidatePath(pathname);
    } catch (error) {
        console.log("Unable to upvote answer", error);
        throw error;
    }
}

export async function downvoteAnswer(params: IAnswerVoteParams) {
    try {
        await connectToDB();

        const { pathname, id, userId, hasDownvoted, hasUpvoted } = params;

        const updates: UpdateQuery<IAnswerSchema> = {};

        if (hasDownvoted) {
            updates.$pull = { downvotes: userId };
        } else if (hasUpvoted) {
            updates.$pull = { upvotes: userId };
            updates.$push = { downvotes: userId };
        } else {
            updates.$addToSet = { downvotes: userId };
        }

        const answer = await AnswerModel.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!answer) throw new Error("Answer not found");

        revalidatePath(pathname);
    } catch (error) {
        console.log("Unable to downvote answer", error);
        throw error;
    }
}
