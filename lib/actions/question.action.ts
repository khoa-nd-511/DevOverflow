"use server";
import { revalidatePath } from "next/cache";

import QuestionModel from "@/database/question.model";
import TagModel, { ITagSchema } from "@/database/tag.model";
import UserModel, { IUser, IUserSchema } from "@/database/user.model";

import {
  ICreateQuestionParams,
  IGetQuestionByIdParams,
  IGetQuestionsParams,
} from "./shared.types";
import { connectToDB } from "../mongoose";

export async function getQuestions(params: IGetQuestionsParams) {
  try {
    await connectToDB();

    const questions = await QuestionModel.find({})
      .populate<{
        tags: ITagSchema[];
      }>({ path: "tags", model: TagModel })
      .populate<{ author: IUser }>({
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
      throw new Error("Unable to find question" + questionId);
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
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
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
