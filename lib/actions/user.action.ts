"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongoose";

export async function getUserById(params: any) {
  const { userId } = params;
  try {
    await connectToDB();

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.error("unable to find user with id", userId);
    throw error;
  }
}
