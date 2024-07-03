import { HomePageFilters } from "@/constants/filters";
import React from "react";
import FilterButton from "../shared/FilterButton";

const HomeFilters = () => {
    const active = "";

    return (
        <div className="mt-10 hidden flex-wrap gap-4 md:flex">
            {HomePageFilters.map(({ name, value }) => (
                <FilterButton
                    key={value}
                    label={name}
                    value={value}
                    active={active}
                />
            ))}
        </div>
    );
};

export default HomeFilters;
