"use server";
import { revalidatePath } from "next/cache";

import QuestionModel, { IQuestionSchema } from "@/database/question.model";
import TagModel, { ITagSchema } from "@/database/tag.model";
import UserModel, { IUserSchema } from "@/database/user.model";

import {
    ICreateQuestionParams,
    IGetQuestionByIdParams,
    IGetQuestionsParams,
    IGetSavedQuestionsParams,
    IQuestionVoteParams,
    IToggleSaveQuestionParams,
} from "./shared.types";
import { connectToDB } from "../mongoose";
import { FilterQuery, UpdateQuery } from "mongoose";
import { redirect } from "next/navigation";

export async function getQuestions(params: IGetQuestionsParams) {
    try {
        await connectToDB();

        const questions = await QuestionModel.find({})
            .populate<{
                tags: ITagSchema[];
            }>({ path: "tags", model: TagModel })
            .populate<{ author: IUserSchema }>({
                path: "author",
                model: UserModel,
            })
            .sort({ createdAt: -1 });

        return { questions };
    } catch (error) {
        console.error("Unable to get questions", error);
        throw error;
    }
}

type SavedQuestion = Omit<IQuestionSchema, "tags" | "author"> & {
    author: Pick<IUserSchema, "_id" | "picture" | "name">;
    tags: Pick<ITagSchema, "_id" | "name">[];
};

export async function getSavedQuestions(params: IGetSavedQuestionsParams) {
    try {
        await connectToDB();

        const { clerkId, searchQuery } = params;

        const query: FilterQuery<typeof QuestionModel> = searchQuery
            ? { title: { $regex: new RegExp(searchQuery, "i") } }
            : {};

        const user = await UserModel.findOne({ clerkId })
            .populate<{ saved: SavedQuestion[] }>({
                path: "saved",
                match: query,
                model: QuestionModel,
                populate: [
                    {
                        path: "tags",
                        select: "_id name",
                        model: TagModel,
                    },
                    {
                        path: "author",
                        select: "_id name picture",
                        model: UserModel,
                    },
                ],
                options: {
                    sort: {
                        createdAt: -1,
                    },
                },
            })
            .sort({ createdAt: -1 });

        if (!user) throw new Error("User not found");

        return user.saved;
    } catch (error) {
        console.error("Unable to get questions", error);
        throw error;
    }
}

export async function getQuestionById(params: IGetQuestionByIdParams) {
    const { questionId } = params;
    try {
        await connectToDB();

        const question = await QuestionModel.findById(questionId)
            .populate<{ tags: Pick<ITagSchema, "_id" | "name">[] }>({
                path: "tags",
                model: TagModel,
                select: "_id name",
            })
            .populate<{
                author: Pick<IUserSchema, "_id" | "picture" | "name">;
            }>({
                path: "author",
                model: UserModel,
                select: "_id clerkId name picture",
            });

        if (!question) {
            return redirect("/");
        }

        return question;
    } catch (error) {
        console.error("Unable to get question by id" + questionId, error);
        throw error;
    }
}

export async function createQuestion(params: ICreateQuestionParams) {
    try {
        await connectToDB();

        const { title, description, tags, author, pathname } = params;

        // create a skeleton for question
        const question = await QuestionModel.create({
            title,
            description,
            author,
        });

        const tagDocuments = [];
        for (const tag of tags) {
            const existingTag = await TagModel.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                {
                    $setOnInsert: { name: tag },
                    $push: { questions: question._id },
                },
                { upsert: true, new: true }
            );

            tagDocuments.push(existingTag._id);
        }

        // populate question with tags found/created
        await QuestionModel.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments } },
        });

        revalidatePath(pathname);
    } catch (error) {
        console.error("Unable to create question", error);
        throw error;
    }
}

export async function upvoteQuestion(params: IQuestionVoteParams) {
    try {
        await connectToDB();

        const { hasDownvoted, hasUpvoted, pathname, id, userId } = params;

        const updates: UpdateQuery<IQuestionSchema> = {};

        if (hasUpvoted) {
            updates.$pull = { upvotes: userId };
        } else if (hasDownvoted) {
            updates.$push = { upvotes: userId };
            updates.$pull = { downvotes: userId };
        } else {
            updates.$addToSet = { upvotes: userId };
        }

        const question = await QuestionModel.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!question) throw new Error("Question not found");

        revalidatePath(pathname);
    } catch (error) {
        console.log("Unable to upvote question", error);
        throw error;
    }
}

export async function downvoteQuestion(params: IQuestionVoteParams) {
    try {
        await connectToDB();

        const { hasDownvoted, hasUpvoted, pathname, id, userId } = params;

        const updates: UpdateQuery<IQuestionSchema> = {};

        if (hasDownvoted) {
            updates.$pull = { downvotes: userId };
        } else if (hasUpvoted) {
            updates.$pull = { upvotes: userId };
            updates.$push = { downvotes: userId };
        } else {
            updates.$addToSet = { downvotes: userId };
        }

        const question = await QuestionModel.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!question) throw new Error("Question not found");

        revalidatePath(pathname);
    } catch (error) {
        console.log("Unable to downvote question", error);
        throw error;
    }
}

export async function saveQuestion(params: IToggleSaveQuestionParams) {
    try {
        await connectToDB();

        const { pathname, id, userId, hasSaved } = params;

        const question = await QuestionModel.findById(id);

        if (!question) throw new Error("Question not found");

        const updates: UpdateQuery<IUserSchema> = {};

        if (hasSaved) {
            updates.$pull = { saved: question._id };
        } else {
            updates.$push = { saved: question._id };
        }

        const user = await UserModel.findByIdAndUpdate(userId, updates, {
            new: true,
        });

        if (!user) throw new Error("User not found");

        revalidatePath(pathname);
    } catch (error) {
        console.log("Unable to save question", error);
        throw error;
    }
}
