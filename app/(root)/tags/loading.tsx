import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between sm:flex-row">
                <h1 className="h1-bold text-dark100_light900 max-sm:mt-6">
                    Tags
                </h1>
            </div>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <Skeleton className="h-[56px] w-full rounded-xl" />
            </div>

            <div className="mt-10 hidden flex-wrap gap-4 md:flex">
                <Skeleton className="h-[40px] w-[120px] rounded-xl" />
                <Skeleton className="h-[40px] w-[120px] rounded-xl" />
                <Skeleton className="h-[40px] w-[120px] rounded-xl" />
                <Skeleton className="h-[40px] w-[120px] rounded-xl" />
            </div>
        </>
    );
};

export default loading;
