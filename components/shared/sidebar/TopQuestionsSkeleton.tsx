import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TopQuestionsSkeleton = () => {
    return (
        <div className="mt-7 flex w-full flex-col gap-[30px]">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
        </div>
    );
};

export default TopQuestionsSkeleton;
