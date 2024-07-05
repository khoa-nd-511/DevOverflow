import UserModel from "@/database/user.model";
import TagModel, { ITagSchema } from "@/database/tag.model";
import QuestionModel from "@/database/question.model";

import { connectToDB } from "../mongoose";
import {
    IGetAllTagsParams,
    IGetQuestionsByTagIdParams,
    IGetTopInteractedTagsParams,
    PopulatedQuestion,
} from "./shared.types";

export async function getAllTags(params: IGetAllTagsParams) {
    try {
        await connectToDB();

        const { page = 1, size = 10 } = params;

        const tags: ITagSchema[] = await TagModel.find({})
            .limit(size)
            .skip((page - 1) * size)
            .sort({ createdAt: -1 });

        return { tags };
    } catch (error) {
        console.error(`Unable to get all tags`, error);
        throw error;
    }
}

export async function getTopInteractedTags(
    params: IGetTopInteractedTagsParams
) {
    try {
        await connectToDB();

        const { userId } = params;

        const user = await UserModel.findById(userId);

        if (!user) {
            throw new Error("User not found" + userId);
        }

        return Array(3)
            .fill(null)
            .map((_, index) => ({ _id: index.toString(), name: "Tag" }));
    } catch (error) {
        console.error(
            `Unable to get top interacted tags for ${params.userId}`,
            error
        );
        throw error;
    }
}

export async function getTagById(params: IGetQuestionsByTagIdParams) {
    try {
        await connectToDB();

        const { tagId, searchQuery } = params;

        const tag = await TagModel.findById(tagId)
            .populate<{ questions: PopulatedQuestion[] }>({
                path: "questions",
                match: searchQuery
                    ? { title: { $regex: searchQuery, $option: "i" } }
                    : {},
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

        if (!tag) throw new Error("Tag not found");

        return tag;
    } catch (error) {
        console.error(`Unable to get tag's questions`, error);
        throw error;
    }
}
