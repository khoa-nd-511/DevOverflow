import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import QuestionForm from "@/components/forms/QuestionForm";
import { getUserById } from "@/lib/actions/user.action";
import { getQuestionById } from "@/lib/actions/question.action";

const EditQuestionPage = async ({
    params: { id: questionId },
}: {
    params: { id: string };
}) => {
    const { userId: clerkId } = auth();

    if (!clerkId) {
        redirect("/sign-in");
    }

    const mongoUser = await getUserById({ clerkId });
    const question = await getQuestionById({ questionId });

    console.log("question", question);

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

            <div className="mt-10">
                <QuestionForm
                    mongoUserId={String(mongoUser._id)}
                    id={String(question._id)}
                    title={question.title}
                    description={question.description}
                    tags={question.tags.map(({ name }) => name)}
                />
            </div>
        </>
    );
};

export default EditQuestionPage;
