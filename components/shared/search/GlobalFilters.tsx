import { Badge } from "@/components/ui/badge";
import { GlobalSearchFilters } from "@/constants/filters";
import { useParsedSearchParams } from "@/lib/hooks";
import { constructURLFromQueryString } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

const GlobalFilters = () => {
    const router = useRouter();
    const { type, searchParamsString } = useParsedSearchParams();

    const handleSelectType = (value: string) => {
        let resultType = value;

        if (resultType === type) {
            resultType = "";
        }

        const newURL = constructURLFromQueryString({
            key: "type",
            searchParams: searchParamsString,
            value: resultType,
        });

        router.push(newURL, { scroll: false });
    };

    return (
        <div className="flex items-center justify-start px-5">
            <p className="body-semibold mr-5">Type:</p>

            <div className="flex flex-wrap items-center justify-start gap-4">
                {GlobalSearchFilters.map(({ name, value }) => (
                    <Badge
                        key={value}
                        className={`cursor-pointer  px-5 py-2.5 ${type === value ? "bg-primary-500 text-light-900" : "bg-light-700 hover:text-primary-500 dark:bg-dark-300"}`}
                        onClick={() => handleSelectType(value)}
                    >
                        {name}
                    </Badge>
                ))}
            </div>
        </div>
    );
};

export default GlobalFilters;
