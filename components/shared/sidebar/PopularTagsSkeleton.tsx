import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const PopularTagsSkeleton = () => {
    return (
        <div className="mt-7 flex w-full flex-col gap-[30px]">
            <Skeleton className="h-[30px] w-[50px]" />
            <Skeleton className="h-[30px] w-[50px]" />
            <Skeleton className="h-[30px] w-[50px]" />
        </div>
    );
};

export default PopularTagsSkeleton;
