import React from "react";

import TagCard from "@/components/cards/TagCard";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import LocalSearch from "@/components/shared/search/LocalSearch";
import CTAButton from "@/components/shared/CTAButton";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { searchParamsSchema } from "@/lib/validations";

const Tag = async ({ searchParams }: { searchParams: unknown }) => {
    const parsedSearchParams = searchParamsSchema.parse(searchParams);

    const { tags } = await getAllTags({ searchQuery: parsedSearchParams.q });

    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between sm:flex-row">
                <h1 className="h1-bold text-dark100_light900 max-sm:mt-6">
                    Tags
                </h1>
            </div>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route="/tags"
                    placeholder="Enter tag name..."
                    otherClasses="flex-1"
                />

                <Filter
                    filters={TagFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <div className="mt-10 flex w-full flex-wrap gap-6">
                {tags.length > 0 ? (
                    tags.map(({ _id, name, questions }) => (
                        <TagCard
                            key={_id as string}
                            id={_id as string}
                            name={name}
                            questions={questions}
                        />
                    ))
                ) : (
                    <NoResults
                        title="No Tags"
                        description="Looks like there has been no questions asked yet"
                        cta={
                            <CTAButton
                                label="Ask a question"
                                href="/ask-question"
                            />
                        }
                    />
                )}
            </div>
        </>
    );
};

export default Tag;
