import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { getTagById } from "@/lib/actions/tag.action";
import React from "react";

const TagDetailsPage = async ({
    params: { id },
}: {
    params: { id: string };
}) => {
    const tag = await getTagById({ tagId: id });

    const { name, questions } = tag;

    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">{name}</h1>

            <div className="mt-10">
                <LocalSearch
                    placeholder={`Search questions related to ${name}...`}
                />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {questions.map((question) => (
                    <QuestionCard
                        key={question._id as string}
                        id={question._id as string}
                        answers={question.answers}
                        author={question.author}
                        createdAt={question.createdAt}
                        tags={question.tags}
                        title={question.title}
                        upvotes={question.upvotes.length}
                        views={question.views}
                    />
                ))}
            </div>
        </div>
    );
};

export default TagDetailsPage;
