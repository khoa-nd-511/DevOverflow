import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/home/QuestionCard";

import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import React from "react";

const questions = [
  {
    _id: 1,
    title: "Title 1",
    tags: [],
    author: "John",
    upvotes: 10,
    views: 100,
    answers: 2,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 1,
    title: "Title 1",
    tags: [],
    author: "John",
    upvotes: 10,
    views: 100,
    answers: 2,
    createdAt: new Date("2024-07-07").toISOString(),
  },
];

const page = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row">
        <h1 className="h1-bold text-dark100_light900 max-sm:mt-6">
          All Questions
        </h1>

        <Link href="/ask-question">
          <Button className="primary-gradient min-h-[46px] w-full px-4 py-3 text-light-900">
            Ask A Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch placeholder="Search questions" />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[65px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map(({ _id, ...params }) => (
            <QuestionCard key={_id} {...params} />
          ))
        ) : (
          <NoResults
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            cta={
              <Link href="/ask-question">
                <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 text-light-900 hover:bg-primary-500 ">
                  Ask a question
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </>
  );
};

export default page;
