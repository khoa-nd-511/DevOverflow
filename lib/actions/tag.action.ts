import User from "@/database/user.model";
import { connectToDB } from "../mongoose";
import { IGetAllTagsParams, IGetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

export async function getAllTags(params: IGetAllTagsParams) {
  try {
    await connectToDB();

    const { page = 1, size = 10 } = params;

    const tags = await Tag.find({})
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

    const user = await User.findById(userId);

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
