import React from "react";
import { getAnswersByQuestionId } from "@/lib/actions/answer.action";
import { getTimestamp } from "@/lib/utils";
import { AnswerFilters } from "@/constants/filters";
import { Separator } from "@/components/ui/separator";

import Filter from "./Filter";
import ParsedHTML from "./ParsedHTML";
import UserDisplay from "./UserDisplay";

interface IAllAnswersProps {
    questionId: string;
    userId: string;
    page?: number;
    filter?: number;
}

const AllAnswers = async ({ questionId }: IAllAnswersProps) => {
    const answers = await getAnswersByQuestionId({ questionId });

    const totalAnswers = answers.length;

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="paragraph-regular text-primary-500">
                    {totalAnswers} Answer{totalAnswers > 1 ? "s" : ""}
                </p>

                <Filter filters={AnswerFilters} />
            </div>

            <div className="flex flex-col gap-5">
                {answers.map(({ _id, content, author, createdAt }, index) => (
                    <div key={String(_id)}>
                        <UserDisplay
                            id={String(author._id)}
                            name={
                                <div className="flex items-center gap-1">
                                    <p className="paragraph-semibold text-dark300_light700">
                                        {author.name}
                                    </p>
                                    <span className="small-regular text-dark400_light500 line-clamp-1">
                                        - answered {getTimestamp(createdAt)}
                                    </span>
                                </div>
                            }
                            imgURL={author.picture}
                        />
                        <div className="text-dark200_light900 mt-4 pl-2">
                            <ParsedHTML key={String(_id)} data={content} />
                        </div>
                        {index < answers.length - 1 && (
                            <Separator className="mb-5 mt-10 h-0.5 bg-light-700 dark:bg-dark-400" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllAnswers;
