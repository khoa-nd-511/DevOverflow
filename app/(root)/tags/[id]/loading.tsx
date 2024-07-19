import CTAButton from "@/components/shared/CTAButton";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between sm:flex-row">
                <h1 className="h1-bold text-dark100_light900 max-sm:mt-6">
                    Saved Questions
                </h1>

                <CTAButton label="Ask a question" href="/ask-question" />
            </div>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <Skeleton className="h-[56px] w-full rounded-xl" />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                <Skeleton className="h-[204px] rounded-lg p-9 sm:p-11" />
                <Skeleton className="h-[204px] rounded-lg p-9 sm:p-11" />
                <Skeleton className="h-[204px] rounded-lg p-9 sm:p-11" />
            </div>
        </>
    );
};

export default loading;
