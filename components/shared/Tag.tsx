import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

interface ITag {
    id: string;
    name: string;
    totalQuestions?: number;
    showCount?: boolean;
}

const Tag = (props: ITag) => {
    const { id, name, showCount = false, totalQuestions = 0 } = props;
    return (
        <div key={id} className="flex items-center justify-between">
            <Link
                href={`/tags/${id}`}
                className="body-medium text-dark500_light700 font-normal"
            >
                <Badge className="subtle-medium background-light800_dark300 text-dark400_light500 rounded-md border-none px-4 py-2 uppercase">
                    {name}
                </Badge>
            </Link>
            {showCount && (
                <p className="small-medium text-dark500_light700">
                    {totalQuestions}
                </p>
            )}
        </div>
    );
};

export default Tag;
