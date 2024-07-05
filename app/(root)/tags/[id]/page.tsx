import QuestionCard from "@/components/cards/QuestionCard";
import CTAButton from "@/components/shared/CTAButton";
import NoResults from "@/components/shared/NoResults";
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
                    placeholder={`Search questions related to ${name} tag...`}
                />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {questions.length > 0 ? (
                    questions.map((question) => {
                        return (
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
                        );
                    })
                ) : (
                    <NoResults
                        title="There's no questions related to this tag"
                        description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
                        cta={
                            <CTAButton
                                label="Ask a question"
                                href="/ask-question"
                                otherClasses="mt-5"
                            />
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default TagDetailsPage;
