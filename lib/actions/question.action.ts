"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";

import { connectToDB } from "../mongoose";
import { ICreateQuestionParams, IGetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: IGetQuestionsParams) {
  try {
    await connectToDB();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { questions };
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
    const question = await Question.create({
      title,
      description,
      author,
    });

    const tagDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    // populate question with tags found/created
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(pathname);
  } catch (error) {
    console.error("Unable to create question", error);
    throw error;
  }
}
