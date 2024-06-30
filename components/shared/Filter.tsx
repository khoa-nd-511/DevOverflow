"use client";
import React from "react";

import { cn } from "@/lib/utils";
import { IFilterOption } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";

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
  return (
    <div className={cn("relative", containerClasses)}>
      <Select>
        <SelectTrigger
          className={`body-regular light-border background-light800_dark300 text-dark500_light700 relative border px-5 py-2.5 ${otherClasses}`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
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
