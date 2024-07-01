"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongoose";
import Tag from "@/database/tag.model";

export async function createQuestion(params: any) {
  try {
    await connectToDB();

    const { title, description, tags, author } = params;

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

      tagDocuments.push(existingTag.id);
    }

    // populate question with tags found/created
    await Question.findByIdAndUpdate(
      { id: question._id },
      { $push: { tags: { $each: tagDocuments } } }
    );
  } catch (error) {}
}
