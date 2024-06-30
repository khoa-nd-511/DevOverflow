import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

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
        Filters
      </div>
    </>
  );
};

export default page;
