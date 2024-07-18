import React from "react";
import Image from "next/image";
import Link from "next/link";

import Tag from "@/components/shared/Tag";
import { getTopQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

const RightSidebar = async () => {
    const topQuestions = await getTopQuestions();
    const popularTags = await getPopularTags();

    return (
        <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen min-w-[350px] flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
            <div className="flex flex-1 flex-col gap-6">
                <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

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
            </div>

            <div className="mt-16 flex flex-1 flex-col gap-6">
                <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

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
            </div>
        </section>
    );
};

export default RightSidebar;
