import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RotateCw } from "lucide-react";

import { useParsedSearchParams } from "@/lib/hooks";
import { TGlobalResult } from "@/lib/actions/shared.types";
import { globalSearch } from "@/lib/actions/global.action";
import { Separator } from "@/components/ui/separator";

import GlobalFilters from "./GlobalFilters";

interface IGlobalResults {
    open: boolean;
    queryString: string;
    onSelectResult: () => void;
}

const GlobalResults = ({
    open,
    queryString,
    onSelectResult,
}: IGlobalResults) => {
    const { g, type } = useParsedSearchParams();
    const [results, setResults] = useState<
        TGlobalResult[] | undefined | null
    >();

    useEffect(() => {
        const fetchResults = async () => {
            setResults(undefined);

            try {
                if (!g) return;
                const results = await globalSearch({
                    query: g,
                    type,
                });
                setResults(results);
            } catch (error) {
                console.error(
                    "Unable to perform global search with",
                    queryString
                );
                setResults(null);
            }
        };

        fetchResults();
    }, [g, queryString, type]);

    return (
        <dialog
            open={open}
            id="global-search-dialog"
            className="text-dark400_light900 top-16 w-full rounded-md bg-light-850 py-5 shadow-lg dark:bg-dark-400"
        >
            <GlobalFilters />

            <Separator className="my-4 h-px bg-light-700 dark:bg-dark-300" />

            <div className="">
                <p className="text-dark400_light900 paragraph-semibold px-5">
                    Top Match
                </p>

                {typeof results === "undefined" ? (
                    <div className="flex flex-col py-10">
                        <RotateCw className="m-auto size-10 animate-spin text-primary-500" />
                        <p className="paragraph-regular text-dark400_light900 mx-auto mt-5 font-light">
                            Browsing the entire database...
                        </p>
                    </div>
                ) : results === null ? (
                    <div className="flex flex-col px-5 py-8">
                        <div className="text-dark200_light800 body-regular m-auto font-light">
                            Something went wrong.
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col gap-2">
                        {results.length ? (
                            results.map((r) => {
                                let href = "/";
                                switch (r.type) {
                                    case "user":
                                        href = `/profile/${r.id}`;
                                        break;
                                    case "tag":
                                        href = `/tags/${r.id}`;
                                        break;
                                    case "question":
                                        href = `/question/${r.id}`;
                                        break;
                                    default:
                                        break;
                                }
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-800 dark:hover:bg-dark-300"
                                        onClick={(e) => onSelectResult()}
                                    >
                                        <Image
                                            src="/assets/icons/tag.svg"
                                            width={18}
                                            height={18}
                                            alt="Tag"
                                            className="invert-colors mt-1 object-contain"
                                        />

                                        <div className="flex flex-col">
                                            <p className="body-medium text-dark200_light800 line-clamp-1">
                                                {r.title}
                                            </p>
                                            <p className="small-medium text-dark400_light500 mt-1 font-bold capitalize">
                                                {r.type}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="flex flex-col px-5 py-8">
                                <div className="text-dark200_light800 body-regular m-auto font-light">
                                    No results match with this search.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </dialog>
    );
};

export default GlobalResults;
