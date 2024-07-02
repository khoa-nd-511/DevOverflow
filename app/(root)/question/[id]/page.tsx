import React from "react";
import Link from "next/link";
import Image from "next/image";

import Metric from "@/components/shared/Metric";
import ParsedHTML from "@/components/shared/ParsedHTML";
import Tag from "@/components/shared/Tag";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatNumber, getTimestamp } from "@/lib/utils";
import AnswerForm from "@/components/forms/AnswerForm";

const QuestionDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const question = await getQuestionById({ questionId: id });

  // console.log("question", question);

  const { author, title, createdAt, answers, views, description, tags } =
    question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <Link
            href={`/profile/${author._id}`}
            className="flex w-full items-center justify-start gap-1"
          >
            <Image
              src={author.picture}
              width={22}
              height={22}
              alt="Author's profile picture"
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {author.name}
            </p>
          </Link>

          <div className="flex w-full justify-end">VOTING</div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {title}
        </h2>

        <div className="mr-auto mt-5 flex flex-wrap gap-4">
          <Metric
            imgURL="/assets/icons/clock.svg"
            alt="Clcok icon"
            value={` asked ${getTimestamp(createdAt)}`}
            title=""
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

      <div className="mb-8 mt-5 flex flex-wrap gap-2">
        {tags.map(({ name, _id }) => (
          <Tag key={String(_id)} name={name} id={String(_id)} />
        ))}
      </div>

      <ParsedHTML data={description} />

      <div className="mt-8">
        <AnswerForm />
      </div>
    </>
  );
};

export default QuestionDetailsPage;
