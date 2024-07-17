"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FilterQuery, UpdateQuery } from "mongoose";

import {
    QuestionModel,
    ITagSchema,
    TagModel,
    IUserSchema,
    UserModel,
    IQuestionSchema,
    AnswerModel,
    InteractionModel,
} from "@/database";
import {
    ICreateQuestionParams,
    IDeleteQuestionParams,
    IEditQuestionParams,
    IGetQuestionByIdParams,
    IGetQuestionsParams,
    IGetSavedQuestionsParams,
    IQuestionVoteParams,
    IToggleSaveQuestionParams,
    PopulatedQuestion,
    PopulatedTag,
    PopulatedUser,
} from "./shared.types";
import { connectToDB } from "../mongoose";

export async function getQuestions(params: IGetQuestionsParams) {
    try {
        await connectToDB();

        const { searchQuery } = params;

        const query: FilterQuery<typeof QuestionModel> = {};

        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { description: { $regex: new RegExp(searchQuery, "i") } },
            ];
        }

        const questions = await QuestionModel.find(query)
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

export async function getSavedQuestions(params: IGetSavedQuestionsParams) {
    try {
        await connectToDB();

        const { clerkId, searchQuery } = params;

        const query: FilterQuery<typeof QuestionModel> = searchQuery
            ? { title: { $regex: new RegExp(searchQuery, "i") } }
            : {};

        const user = await UserModel.findOne({ clerkId })
            .populate<{ saved: PopulatedQuestion[] }>({
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
                        select: "_id clerkId name picture",
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
            .populate<{ tags: PopulatedTag[] }>({
                path: "tags",
                model: TagModel,
                select: "_id name",
            })
            .populate<{
                author: PopulatedUser;
            }>({
                path: "author",
                model: UserModel,
                select: "_id clerkId name picture",
            });

        if (!question) {
            redirect("/");
        }

        return question;
    } catch (error) {
        console.error("Unable to get question by id" + questionId, error);
        redirect("/");
    }
}

export async function getTopQuestions() {
    try {
        await connectToDB();

        const questions = await QuestionModel.find({})
            .sort({
                views: -1,
                upvotes: -1,
            })
            .limit(5);

        return questions;
    } catch (error) {
        console.error("Unable to get questions", error);
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

export async function editQuestion(params: IEditQuestionParams) {
    const { questionId, title, description, pathname } = params;
    try {
        await connectToDB();

        const question = await QuestionModel.findOneAndUpdate(
            { _id: questionId },
            {
                title,
                description,
            }
        );

        if (!question) {
            throw new Error("Question not found");
        }

        revalidatePath(pathname);
    } catch (error) {
        console.error("Unable to edit question", questionId, error);
        throw error;
    }
}

export async function deleteQuestion(params: IDeleteQuestionParams) {
    const { questionId, pathname } = params;
    try {
        await connectToDB();

        await Promise.all([
            QuestionModel.findByIdAndDelete(questionId),
            AnswerModel.deleteMany({ question: questionId }),
            InteractionModel.deleteMany({ question: questionId }),
            TagModel.updateMany(
                { questions: questionId },
                { $pull: { questions: questionId } }
            ),
        ]);

        revalidatePath(pathname);
    } catch (error) {
        console.error("Unable to delete question", questionId, error);
        throw error;
    }
}
