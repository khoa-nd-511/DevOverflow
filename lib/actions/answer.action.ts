"use server";

import { SortOrder, UpdateQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import {
    AnswerModel,
    IAnswerSchema,
    InteractionModel,
    QuestionModel,
    UserModel,
} from "@/database";
import {
    IAnswerVoteParams,
    ICreateAnswerParams,
    IDeleteAnswerParams,
    IGetAnswersParams,
    PopulatedUser,
} from "./shared.types";
import { connectToDB } from "../mongoose";
import {
    SUBMIT_ANSWER_POINTS,
    VOTE_ANSWER_GIVEN_POINTS,
    VOTE_ANSWER_RECEIVED_POINTS,
} from "@/constants";

export async function getAnswersByQuestionId(params: IGetAnswersParams) {
    try {
        await connectToDB();

        const { questionId, filter } = params;

        let sortOption: Record<string, SortOrder> = { createdAt: -1 };

        // export const AnswerFilters = [
        //     { name: "Highest Upvotes", value: "highest_upvotes" },
        //     { name: "Lowest Upvotes", value: "lowest_upvotes" },
        //     { name: "Most Recent", value: "recent" },
        //     { name: "Oldest", value: "old" },

        if (filter) {
            sortOption = {};

            switch (filter) {
                case "highest_upvotes":
                    sortOption.upvotes = -1;
                    break;
                case "lowest_upvotes":
                    sortOption.downvotes = -1;
                    break;
                case "recent":
                    sortOption.createdAt = -1;
                    break;
                case "old":
                    sortOption.createdAt = 1;
                    break;
            }
        }

        const answers = await AnswerModel.find({ question: questionId })
            .sort(sortOption)
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

        const queriedQuestion = await QuestionModel.findByIdAndUpdate(
            question,
            {
                $push: { answers: answer._id },
            }
        );

        //     user: Schema.Types.ObjectId;
        // action: string;
        // question: Schema.Types.ObjectId;
        // answer: Schema.Types.ObjectId;
        // tags: Schema.Types.ObjectId[];

        if (!queriedQuestion) {
            throw new Error("Unable to find question " + question);
        }

        await InteractionModel.create({
            user: author,
            action: "answer",
            question,
            answer: answer._id,
            tags: queriedQuestion.tags,
        });

        await UserModel.findByIdAndUpdate(author, {
            $inc: { reputation: SUBMIT_ANSWER_POINTS },
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

        let authorReputationChange = 0;
        let voterReputationChange = 0;

        if (hasUpvoted) {
            updates.$pull = { upvotes: userId };
            authorReputationChange -= VOTE_ANSWER_RECEIVED_POINTS;
            voterReputationChange -= VOTE_ANSWER_GIVEN_POINTS;
        } else if (hasDownvoted) {
            updates.$push = { upvotes: userId };
            updates.$pull = { downvotes: userId };
            authorReputationChange += VOTE_ANSWER_RECEIVED_POINTS * 2;
            voterReputationChange += VOTE_ANSWER_GIVEN_POINTS * 2;
        } else {
            updates.$addToSet = { upvotes: userId };
            authorReputationChange += VOTE_ANSWER_RECEIVED_POINTS;
            voterReputationChange += VOTE_ANSWER_GIVEN_POINTS;
        }

        const answer = await AnswerModel.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!answer) throw new Error("Answer not found");

        const [author, voter] = await Promise.all([
            UserModel.findById(answer.author),
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
        console.log("Unable to upvote answer", error);
        throw error;
    }
}

export async function downvoteAnswer(params: IAnswerVoteParams) {
    try {
        await connectToDB();

        const { pathname, id, userId, hasDownvoted, hasUpvoted } = params;

        const updates: UpdateQuery<IAnswerSchema> = {};

        let authorReputationChange = 0;
        let voterReputationChange = 0;

        if (hasDownvoted) {
            updates.$pull = { downvotes: userId };
            authorReputationChange += VOTE_ANSWER_RECEIVED_POINTS;
            voterReputationChange += VOTE_ANSWER_GIVEN_POINTS;
        } else if (hasUpvoted) {
            updates.$pull = { upvotes: userId };
            updates.$push = { downvotes: userId };
            authorReputationChange -= VOTE_ANSWER_RECEIVED_POINTS * 2;
            voterReputationChange -= VOTE_ANSWER_GIVEN_POINTS * 2;
        } else {
            updates.$addToSet = { downvotes: userId };
            authorReputationChange -= VOTE_ANSWER_RECEIVED_POINTS;
            voterReputationChange -= VOTE_ANSWER_GIVEN_POINTS;
        }

        const answer = await AnswerModel.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!answer) throw new Error("Answer not found");

        const [author, voter] = await Promise.all([
            UserModel.findById(answer.author),
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
        console.log("Unable to downvote answer", error);
        throw error;
    }
}

export async function deleteAnswer(params: IDeleteAnswerParams) {
    const { answerId, pathname } = params;
    try {
        await connectToDB();

        const answer = await AnswerModel.findById(answerId);

        if (!answer) {
            throw new Error("Answer not found " + answerId);
        }

        await Promise.all([
            AnswerModel.deleteOne({ _id: answerId }),
            QuestionModel.updateMany(
                { _id: answer.question },
                { $pull: { answers: answerId } }
            ),
            InteractionModel.deleteMany({ answer: answerId }),
        ]);

        revalidatePath(pathname);
    } catch (error) {
        console.error("Unable to delete answer", answerId, error);
        throw error;
    }
}
