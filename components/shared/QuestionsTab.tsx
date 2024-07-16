import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";

interface IQuestionsTabProps extends SearchParamsProps {
    userId: string;
    clerkId: string;
}

const QuestionsTab = async ({ userId, clerkId }: IQuestionsTabProps) => {
    const { userQuestions } = await getUserQuestions({
        userId,
        page: 1,
        pageSize: 10,
    });
    return (
        <div className="mt-10 flex flex-col gap-6">
            {userQuestions.map((question) => {
                return (
                    <QuestionCard
                        key={String(question._id)}
                        id={String(question._id)}
                        answers={question.answers}
                        author={question.author}
                        createdAt={question.createdAt}
                        tags={question.tags}
                        title={question.title}
                        upvotes={question.upvotes.length}
                        views={question.views}
                        clerkId={clerkId}
                    />
                );
            })}
        </div>
    );
};

export default QuestionsTab;
