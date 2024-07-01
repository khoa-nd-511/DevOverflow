import { HomePageFilters } from "@/constants/filters";
import React from "react";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const active = "";

  return (
    <div className="mt-10 flex flex-wrap gap-4">
      {HomePageFilters.map(({ name, value }) => (
        <Button
          key={value}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${active === value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500 dark:bg-dark-300 dark:text-light-500"}`}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
