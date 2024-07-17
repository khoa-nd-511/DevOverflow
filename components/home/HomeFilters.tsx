"use client";

import { HomePageFilters } from "@/constants/filters";
import React from "react";
import FilterButton from "../shared/FilterButton";
import { searchParamsSchema } from "@/lib/validations";
import { useRouter, useSearchParams } from "next/navigation";
import { constructURLFromQueryString } from "@/lib/utils";

const HomeFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const parsedSearchParams = searchParamsSchema.parse({
        filter: searchParams.get("filter"),
    });

    const onSelectFilter = (value: string) => {
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
        <div className="mt-10 hidden flex-wrap gap-4 md:flex">
            {HomePageFilters.map(({ name, value }) => (
                <FilterButton
                    key={value}
                    label={name}
                    value={value}
                    active={parsedSearchParams.filter}
                    onSelectFilter={onSelectFilter}
                />
            ))}
        </div>
    );
};

export default HomeFilters;
