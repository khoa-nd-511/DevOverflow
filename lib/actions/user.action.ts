"use server";

import { revalidatePath } from "next/cache";

import { UserModel, QuestionModel, AnswerModel } from "@/database";
import {
    ICreateUserParams,
    IDeleteUserParams,
    IGetAllUsersParams,
    IGetUserByClerkIdParams,
    IGetUserStatsParams,
    IUpdateUserParams,
    PopulatedQuestionCompact,
    PopulatedTag,
    PopulatedUser,
} from "./shared.types";
import { connectToDB } from "../mongoose";

export async function getAllUsers(params: IGetAllUsersParams) {
    try {
        await connectToDB();

        // const { page = 1, pageSize = 10, filter, searchQuery } = params;

        const users = await UserModel.find({}).sort({ joinedAt: -1 });

        return { users };
    } catch (error) {
        console.error("unable to fetch users");
        throw error;
    }
}

export async function getUserById(params: IGetUserByClerkIdParams) {
    const { clerkId } = params;
    try {
        await connectToDB();

        const user = await UserModel.findOne({ clerkId });

        if (!user) {
            throw new Error("User not found" + clerkId);
        }

        return user;
    } catch (error) {
        console.error("unable to find user with id", clerkId);
        throw error;
    }
}

export async function getUserInfo(params: IGetUserByClerkIdParams) {
    const { clerkId } = params;
    try {
        await connectToDB();

        const user = await UserModel.findOne({ clerkId });

        if (!user) {
            throw new Error("User not found" + clerkId);
        }

        const [totalQuestions, totalAnswers] = await Promise.all([
            QuestionModel.countDocuments({
                author: user._id,
            }),
            AnswerModel.countDocuments({
                author: user._id,
            }),
        ]);

        return { user, totalAnswers, totalQuestions };
    } catch (error) {
        console.error("unable to find user info", clerkId);
        throw error;
    }
}

export async function getUserQuestions(params: IGetUserStatsParams) {
    const { userId, page = 1, pageSize = 10 } = params;
    try {
        await connectToDB();

        const user = await UserModel.findOne({ userId });

        if (!user) {
            throw new Error("User not found" + userId);
        }

        const totalQuestions = await QuestionModel.countDocuments({
            author: userId,
        });

        const userQuestions = await QuestionModel.find({ author: userId })
            .sort({ views: -1, upvotes: -1 })
            .skip((page - 1) * pageSize)
            .populate<{ tags: PopulatedTag[] }>("tags", "_id name")
            .populate<{
                author: PopulatedUser;
            }>("author", "_id clerkId name picture");

        return { totalQuestions, userQuestions };
    } catch (error) {
        console.error("unable to find user questions", userId);
        throw error;
    }
}

export async function getUserAnswers(params: IGetUserStatsParams) {
    const { userId, page = 1, pageSize = 10 } = params;
    try {
        await connectToDB();

        const user = await UserModel.findOne({ userId });

        if (!user) {
            throw new Error("User not found" + userId);
        }

        const [totalAnswers, userAnswers] = await Promise.all([
            AnswerModel.countDocuments({
                author: userId,
            }),
            AnswerModel.find({ author: userId })
                .sort({ upvotes: -1 })
                .skip((page - 1) * pageSize)
                .populate<{
                    author: PopulatedUser;
                }>("author", "_id clerkId name picture")
                .populate<{ question: PopulatedQuestionCompact }>(
                    "question",
                    "_id title"
                ),
        ]);

        return { totalAnswers, userAnswers };
    } catch (error) {
        console.error("unable to find user answers", userId);
        throw error;
    }
}

export async function createUser(params: ICreateUserParams) {
    try {
        await connectToDB();

        const user = await UserModel.create(params);

        return user;
    } catch (error) {
        console.error("unable to create user");
        throw error;
    }
}

export async function updateUser(params: IUpdateUserParams) {
    try {
        await connectToDB();

        const { clerkId, payload, pathname } = params;

        await UserModel.findOneAndUpdate({ clerkId }, payload, { new: true });

        revalidatePath(pathname);
    } catch (error) {
        console.error("unable to create user");
        throw error;
    }
}

export async function deleteUser(params: IDeleteUserParams) {
    try {
        await connectToDB();

        const { clerkId } = params;

        const user = await UserModel.findOneAndDelete({ clerkId });

        if (!user) {
            throw new Error("User not found");
        }

        // delete questions
        /* const userQuestionIds = */ await QuestionModel.find({
            author: user._id,
        }).distinct("_id");

        await QuestionModel.deleteMany({ author: user._id });

        // TODO: delete user answers, comments

        const deletedUser = await UserModel.findByIdAndDelete(user._id);

        return deletedUser;
    } catch (error) {
        console.error("unable to create user");
        throw error;
    }
}
