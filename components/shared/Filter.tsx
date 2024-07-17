"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn, constructURLFromQueryString } from "@/lib/utils";
import { IFilterOption } from "@/types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { searchParamsSchema } from "@/lib/validations";

interface IFilterProps {
    filters: IFilterOption[];
    otherClasses?: string;
    containerClasses?: string;
}

const Filter = ({
    filters,
    containerClasses = "",
    otherClasses = "",
}: IFilterProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const parsedSearchParams = searchParamsSchema.parse({
        filter: searchParams.get("filter"),
    });

    const handleSelectFilter = (value: string) => {
        let filter = value;

        if (value === parsedSearchParams.filter) {
            filter = "";
        }

        const newURL = constructURLFromQueryString({
            key: "filter",
            searchParams: searchParams.toString(),
            value: filter,
        });

        router.push(newURL, { scroll: false });
    };

    return (
        <div className={cn("relative", containerClasses)}>
            <Select onValueChange={handleSelectFilter}>
                <SelectTrigger
                    className={`body-regular light-border background-light800_dark300 text-dark500_light700 relative border px-5 py-2.5 ${otherClasses}`}
                >
                    <div className="mr-2 line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Select a filter" />
                    </div>
                </SelectTrigger>
                <SelectContent className="background-light900_dark300 text-dark500_light700 dark:border-none">
                    <SelectGroup>
                        {filters.map(({ name, value }) => (
                            <SelectItem key={value} value={value}>
                                {name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default Filter;
