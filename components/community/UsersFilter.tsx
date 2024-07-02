import { UserFilters } from "@/constants/filters";
import React from "react";
import FilterButton from "../shared/FilterButton";

const UsersFilter = () => {
  const active = "";

  return (
    <div className="mt-10 hidden flex-wrap gap-4 md:flex">
      {UserFilters.map(({ name, value }) => (
        <FilterButton key={value} label={name} value={value} active={active} />
      ))}
    </div>
  );
};

export default UsersFilter;
