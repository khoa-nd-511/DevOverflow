import React from "react";
import Link from "next/link";

import { Badge } from "../ui/badge";

interface ITagCardProps {
    id: string;
    name: string;
    questions: object[];
}

const TagCard = async ({ id, name, questions }: ITagCardProps) => {
    return (
        <Link href={`/tags/${id}`}>
            {/* <div className="card-wrapper w-full rounded-lg p-9 sm:p-11 md:w-[260px]">
        <div className="flex flex-col items-start gap-6"> */}
            <Badge className="rounded-md bg-light-800 px-4 py-2 dark:bg-dark-400">
                <p className="paragraph-semibold text-dark300_light900">
                    {name}
                </p>
            </Badge>

            {/* <p className="small-regular text-dark400_light700">
            JavaScript, often abbreviated as JS, is a programming language that
            is one of the core technologies of the World Wide Web, alongside
            HTML and CSS
          </p> */}

            {/* <div className="body-semibold flex gap-4">
            <span className="text-primary-500">{questions.length}+</span>
            <p className="text-light-500">Questions</p>
          </div>
        </div> */}
            {/* </div> */}
        </Link>
    );
};

export default TagCard;
