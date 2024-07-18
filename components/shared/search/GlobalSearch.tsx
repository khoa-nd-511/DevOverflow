import React, { ElementRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { constructURLFromQueryString } from "@/lib/utils";
import GlobalResults from "./GlobalResults";
import { useParsedSearchParams } from "@/lib/hooks";

const GlobalSearch = () => {
    const router = useRouter();
    const pathname = usePathname();

    const { searchParamsString, g } = useParsedSearchParams();

    const containerRef = useRef<ElementRef<"div">>(null);

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(g);

    useEffect(() => {
        const handleOutSideClick = (e: MouseEvent) => {
            if (
                e.target &&
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("click", handleOutSideClick);

        return () => {
            document.removeEventListener("click", handleOutSideClick);
        };
    }, [pathname]);

    useEffect(() => {
        // TODO: fixed race condition bug
        const timeoutId = setTimeout(() => {
            const newURL = constructURLFromQueryString({
                searchParams: searchParamsString,
                key: "g",
                value: search.trim(),
            });

            router.push(newURL, { scroll: false });
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [router, search, searchParamsString]);

    const handleSelectResult = () => {
        setSearch("");
        setOpen(false);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-[600px] flex-1 max-lg:hidden"
        >
            <div className="background-light800_dark300 relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ">
                <Image
                    src="/assets/icons/search.svg"
                    alt="Search"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
                <Input
                    type="text"
                    placeholder="Search anything globally..."
                    className="text-dark400_light900 paragraph-regular no-focus placeholder ml-4 border-none bg-transparent shadow-none"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);

                        if (!open) {
                            setOpen(true);
                        } else if (!e.target.value.trim()) {
                            setOpen(false);
                        }
                    }}
                />
            </div>

            <GlobalResults
                open={open}
                queryString={g}
                onSelectResult={handleSelectResult}
            />
        </div>
    );
};

export default GlobalSearch;
