"use client";

import React from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ILocalSearch {
    route?: string;
    iconPosition?: "left" | "right";
    placeholder?: string;
    imgURL?: string;
    otherClasses?: string;
}

const LocalSearch = ({
    placeholder = "",
    route = "/",
    iconPosition = "left",
    imgURL = "/assets/icons/search.svg",
    otherClasses = "",
}: ILocalSearch) => {
    return (
        <div className="relative w-full">
            <div
                className={cn(
                    "background-light800_darkgradient text-dark300_light900 relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4",
                    iconPosition === "right" && "flex-row-reverse",
                    otherClasses
                )}
            >
                <Image
                    src={imgURL}
                    alt="Search"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
                <Input
                    type="text"
                    placeholder={placeholder}
                    className="paragraph-regular no-focus placeholder background-light800_darkgradient ml-4 border-none shadow-none outline-none"
                />
            </div>
        </div>
    );
};

export default LocalSearch;
