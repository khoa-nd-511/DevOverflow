import QuestionForm from "@/components/forms/QuestionForm";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  let { userId } = auth();

  userId = "123456789";

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });

  console.log("mongoUser", mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <QuestionForm mongoUserId={String(mongoUser._id)} />
      </div>
    </div>
  );
};

export default Page;
