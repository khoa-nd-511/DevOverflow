import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
    return (
        <>
            <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
                <div className="flex flex-col items-start gap-4 lg:flex-row">
                    <Skeleton className="size-[140px] rounded-full" />

                    <div className="mt-3">
                        <Skeleton className="h-[30px] w-[150px]" />

                        <Skeleton className="mt-2 h-[20px] w-[100px]" />
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <Skeleton className="mt-2 h-[25px] w-[60px]" />

                <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
                    <Skeleton className="h-[159px] w-full" />
                    <Skeleton className="h-[159px] w-full" />
                    <Skeleton className="h-[159px] w-full" />
                    <Skeleton className="h-[159px] w-full" />
                </div>
            </div>
        </>
    );
};

export default loading;
