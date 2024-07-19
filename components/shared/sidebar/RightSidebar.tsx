import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import Tag from "@/components/shared/Tag";
import { getTopQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";
import TopQuestionsSkeleton from "./TopQuestionsSkeleton";
import PopularTagsSkeleton from "./PopularTagsSkeleton";

const TopQuestions = async () => {
    const topQuestions = await getTopQuestions();
    return (
        <div className="mt-7 flex w-full flex-col gap-[30px]">
            {topQuestions.map(({ _id, title }) => {
                return (
                    <Link
                        key={String(_id)}
                        href={`/question/${_id}`}
                        className="flex cursor-pointer items-center justify-between gap-7"
                    >
                        <p className="body-medium text-dark500_light700">
                            {title}
                        </p>
                        <Image
                            src="/assets/icons/chevron-right.svg"
                            alt="chevron right"
                            width={20}
                            height={20}
                            className="invert-colors"
                        />
                    </Link>
                );
            })}
        </div>
    );
};

const PopularTags = async () => {
    const popularTags = await getPopularTags();
    return (
        <div className="mt-7 flex w-full flex-col gap-[30px]">
            {popularTags.map((tag) => {
                return (
                    <Tag
                        key={String(tag._id)}
                        id={String(tag._id)}
                        name={tag.name}
                        totalQuestions={tag.numberOfQuestions}
                        showCount
                    />
                );
            })}
        </div>
    );
};

const RightSidebar = () => {
    return (
        <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
            <div className="flex flex-1 flex-col gap-6">
                <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

                <Suspense fallback={<TopQuestionsSkeleton />}>
                    <TopQuestions />
                </Suspense>
            </div>

            <div className="mt-16 flex flex-1 flex-col gap-6">
                <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

                <Suspense fallback={<PopularTagsSkeleton />}>
                    <PopularTags />
                </Suspense>
            </div>
        </section>
    );
};

export default RightSidebar;
