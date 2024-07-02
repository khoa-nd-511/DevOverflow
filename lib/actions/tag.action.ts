import User from "@/database/user.model";
import { connectToDB } from "../mongoose";
import { IGetTopInteractedTagsParams } from "./shared.types";

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
