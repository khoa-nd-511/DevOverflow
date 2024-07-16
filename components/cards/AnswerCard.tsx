import Link from "next/link";

import Metric from "../shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import {
    PopulatedQuestionCompact,
    PopulatedUser,
} from "@/lib/actions/shared.types";
import EditDeleteButtons from "../shared/EditDeleteButtons";

interface Props {
    id: string;
    clerkId: string;
    question: PopulatedQuestionCompact;
    author: PopulatedUser;
    upvotes: number;
    createdAt: Date;
}

const AnswerCard = ({
    clerkId,
    id,
    question,
    author,
    upvotes,
    createdAt,
}: Props) => {
    const showActionButtons = clerkId && clerkId === author.clerkId;

    return (
        <Link
            href={`/question/${question._id}/#${id}`}
            className="card-wrapper rounded-[10px] px-11 py-9"
        >
            <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
                <div>
                    <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
                        {getTimestamp(createdAt)}
                    </span>
                    <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                        {question.title}
                    </h3>
                </div>

                <SignedIn>
                    {showActionButtons && (
                        <EditDeleteButtons type="answer" id={id} />
                    )}
                </SignedIn>
            </div>

            <div className="flex-between mt-6 w-full flex-wrap gap-3">
                <Metric
                    imgURL={author.picture}
                    alt="user avatar"
                    value={author.name}
                    title={` • asked ${getTimestamp(createdAt)}`}
                    href={`/profile/${author.clerkId}`}
                    otherClasses="body-medium text-dark400_light700"
                    isAuthor
                />

                <div className="flex-center gap-3">
                    <Metric
                        imgURL="/assets/icons/like.svg"
                        alt="like icon"
                        value={formatNumber(upvotes)}
                        title=" Votes"
                        otherClasses="small-medium text-dark400_light800"
                    />
                </div>
            </div>
        </Link>
    );
};

export default AnswerCard;
