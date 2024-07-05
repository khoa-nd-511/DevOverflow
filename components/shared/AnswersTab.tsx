import React from "react";

import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";

interface IAnswersTabProps extends SearchParamsProps {
    userId: string;
    clerkId: string;
}

const AnswersTab = async ({ userId }: IAnswersTabProps) => {
    const { userAnswers } = await getUserAnswers({
        userId,
        page: 1,
        pageSize: 10,
    });

    console.log("userAnswers", userAnswers);

    return (
        <div className="mt-10 flex flex-col gap-6">
            {userAnswers.map(
                ({ _id, author, question, upvotes, createdAt }) => (
                    <AnswerCard
                        id={String(_id)}
                        author={author}
                        question={question}
                        upvotes={upvotes.length}
                        createdAt={createdAt}
                        // clerkId={}
                        key={String(_id)}
                    />
                )
            )}
        </div>
    );
};

export default AnswersTab;
