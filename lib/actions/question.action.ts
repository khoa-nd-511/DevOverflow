"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FilterQuery, SortOrder, UpdateQuery } from "mongoose";

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
import {
    ASK_QUESTION_POINTS,
    VOTE_GIVEN_POINTS,
    VOTE_RECEIVED_POINTS,
} from "@/constants";

export async function getQuestions(params: IGetQuestionsParams) {
    try {
        await connectToDB();

        const { searchQuery, filter } = params;

        const query: FilterQuery<typeof QuestionModel> = {};
        let sortOption: Record<string, SortOrder> = { createdAt: -1 };

        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { description: { $regex: new RegExp(searchQuery, "i") } },
            ];
        }

        if (filter) {
            sortOption = {};
            switch (filter) {
                case "newest":
                    sortOption.updatedAt = -1;
                    sortOption.createdAt = -1;
                    break;
                case "recommended":
                    break;
                case "frequent":
                    sortOption.views = -1;
                    break;
                case "unanswered":
                    query.answers = { $size: 0 };
                    sortOption.createdAt = -1;
                    break;

                default:
                    break;
            }
        }

        const questions = await QuestionModel.find(query)
            .populate<{
                tags: ITagSchema[];
            }>({ path: "tags", model: TagModel })
            .populate<{ author: IUserSchema }>({
                path: "author",
                model: UserModel,
            })
            .sort(sortOption);

        return { questions };
    } catch (error) {
        console.error("Unable to get questions", error);
        throw error;
    }
}

export async function getSavedQuestions(params: IGetSavedQuestionsParams) {
    try {
        await connectToDB();

        const { clerkId, searchQuery, filter } = params;

        const query: FilterQuery<typeof QuestionModel> = {};
        let sortOption: Record<string, SortOrder> = { createdAt: -1 };

        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { description: { $regex: new RegExp(searchQuery, "i") } },
            ];
        }

        if (filter) {
            sortOption = {};
            switch (filter) {
                case "most_recent":
                    sortOption.createdAt = -1;
                    break;
                case "oldest":
                    sortOption.createdAt = 1;
                    break;
                case "most_voted":
                    sortOption.upvoted = -1;
                    break;
                case "most_viewed":
                    sortOption.views = -1;
                    break;
                case "most_answered":
                    sortOption.answers = -1;
                    break;

                default:
                    break;
            }
        }

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
                    sort: sortOption,
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

        await InteractionModel.create({
            user: author,
            question: question._id,
            action: "ask_question",
            tags: tagDocuments,
        });

        await UserModel.findByIdAndUpdate(author, {
            $inc: { reputation: ASK_QUESTION_POINTS },
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

        let authorReputationChange = 0;
        let voterReputationChange = 0;

        if (hasUpvoted) {
            updates.$pull = { upvotes: userId };
            authorReputationChange -= VOTE_RECEIVED_POINTS;
            voterReputationChange -= VOTE_GIVEN_POINTS;
        } else if (hasDownvoted) {
            updates.$push = { upvotes: userId };
            updates.$pull = { downvotes: userId };
            authorReputationChange += VOTE_RECEIVED_POINTS * 2;
            voterReputationChange += VOTE_GIVEN_POINTS * 2;
        } else {
            updates.$addToSet = { upvotes: userId };
            authorReputationChange += VOTE_RECEIVED_POINTS;
            voterReputationChange += VOTE_GIVEN_POINTS;
        }

        const question = await QuestionModel.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!question) throw new Error("Question not found");

        const [author, voter] = await Promise.all([
            UserModel.findById(question.author),
            UserModel.findById(userId),
        ]);

        if (!author || !voter) {
            throw new Error("unable to find author/voter");
        }

        if (author.reputation === undefined) {
            author.reputation = 0;
        }
        if (voter.reputation === undefined) {
            voter.reputation = 0;
        }

        author.reputation += authorReputationChange;
        voter.reputation += voterReputationChange;

        await Promise.all([author.save(), voter.save()]);

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

        let authorReputationChange = 0;
        let voterReputationChange = 0;

        if (hasDownvoted) {
            updates.$pull = { downvotes: userId };
            authorReputationChange += VOTE_RECEIVED_POINTS;
            voterReputationChange += VOTE_GIVEN_POINTS;
        } else if (hasUpvoted) {
            updates.$pull = { upvotes: userId };
            updates.$push = { downvotes: userId };
            authorReputationChange -= VOTE_RECEIVED_POINTS * 2;
            voterReputationChange -= VOTE_GIVEN_POINTS * 2;
        } else {
            updates.$addToSet = { downvotes: userId };
            authorReputationChange -= VOTE_RECEIVED_POINTS;
            voterReputationChange -= VOTE_GIVEN_POINTS;
        }

        const question = await QuestionModel.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!question) throw new Error("Question not found");

        const [author, voter] = await Promise.all([
            UserModel.findById(question.author),
            UserModel.findById(userId),
        ]);

        if (!author || !voter) {
            throw new Error("unable to find author/voter");
        }

        if (author.reputation === undefined) {
            author.reputation = 0;
        }
        if (voter.reputation === undefined) {
            voter.reputation = 0;
        }

        author.reputation += authorReputationChange;
        voter.reputation += voterReputationChange;

        await Promise.all([author.save(), voter.save()]);

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
