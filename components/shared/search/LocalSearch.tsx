"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { cn, constructURLFromQueryString } from "@/lib/utils";
import { searchParamsSchema } from "@/lib/validations";

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
    const router = useRouter();
    const searchParams = useSearchParams();

    const searchParamsString = searchParams.toString();

    const parsedQuery = searchParamsSchema.parse({
        q: searchParams.get("q"),
    });

    const [search, setSearch] = useState(parsedQuery.q);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const newURL = constructURLFromQueryString({
                searchParams: searchParamsString,
                key: "q",
                value: search.trim(),
            });

            router.push(newURL, { scroll: false });
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [router, search, searchParamsString]);

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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="paragraph-regular no-focus placeholder background-light800_darkgradient ml-4 border-none shadow-none outline-none"
                />
            </div>
        </div>
    );
};

export default LocalSearch;
