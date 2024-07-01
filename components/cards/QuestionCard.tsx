import Link from "next/link";
import React from "react";
import Tag from "../shared/Tag";
import Metric from "../shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";

interface IQuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  answers,
  author,
  createdAt,
  tags,
  title,
  upvotes,
  views,
}: IQuestionProps) => {
  return (
    <div className="card-wrapper rounded-lg p-9 sm:p-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark500_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>

          <Link href={`/questions/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        {/* if signed in add edit/delete actions */}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map(({ _id, name }) => (
          <Tag key={_id} _id={_id} name={name} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          // imgURL={author.picture}
          imgURL="/assets/icons/avatar.svg"
          alt="Author picture"
          value={author.name}
          title={`- asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          otherClasses="body-meidum text-dark400_light700"
        />
        <div className="flex items-center gap-3">
          <Metric
            imgURL="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatNumber(upvotes)}
            title="Votes"
            otherClasses="small-regular text-dark400_light800"
          />
          <Metric
            imgURL="/assets/icons/message.svg"
            alt="Message"
            value={formatNumber(answers.length)}
            title="Answers"
            otherClasses="small-regular text-dark400_light800"
          />
          <Metric
            imgURL="/assets/icons/eye.svg"
            alt="eye"
            value={formatNumber(views)}
            title="Views"
            otherClasses="small-regular text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
