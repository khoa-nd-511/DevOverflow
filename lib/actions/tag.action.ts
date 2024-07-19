import { ITagSchema, TagModel, UserModel, QuestionModel } from "@/database";
import { connectToDB } from "../mongoose";
import {
    IGetAllTagsParams,
    IGetQuestionsByTagIdParams,
    IGetTopInteractedTagsParams,
    PopularTag,
    PopulatedQuestion,
} from "./shared.types";
import console from "console";
import { FilterQuery, SortOrder } from "mongoose";

export async function getAllTags(params: IGetAllTagsParams) {
    try {
        await connectToDB();

        const { page = 1, size = 10, searchQuery, filter } = params;

        const query: FilterQuery<typeof TagModel> = {};
        let sortOption: Record<string, SortOrder> = { createdAt: -1 };

        if (searchQuery) {
            query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
        }

        if (filter) {
            sortOption = {};
            switch (filter) {
                case "popular":
                    sortOption.questions = 1;
                    break;
                case "recent":
                    sortOption.createdAt = -1;
                    break;
                case "name":
                    sortOption.name = 1;
                    break;
                case "old":
                    sortOption.createdAt = 1;
                    break;

                default:
                    break;
            }
        }

        const tags: ITagSchema[] = await TagModel.find(query)
            .limit(size)
            .skip((page - 1) * size)
            .sort(sortOption);

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
                    ? { title: { $regex: new RegExp(searchQuery, "i") } }
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

export async function getPopularTags() {
    try {
        await connectToDB();

        const tags: PopularTag[] = await TagModel.aggregate([
            {
                $project: {
                    name: 1,
                    numberOfQuestions: { $size: "$questions" },
                },
            },
            { $sort: { numberOfQuestions: -1 } },
            { $limit: 5 },
        ]);

        return tags;
    } catch (error) {
        console.error(`Unable to get all tags`, error);
        throw error;
    }
}
