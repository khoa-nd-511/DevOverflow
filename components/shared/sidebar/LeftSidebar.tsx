"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { sidebarLinks } from "@/constants";

const LeftSidebar = () => {
    const { userId: clerkId } = useAuth();

    const pathname = usePathname();

    return (
        <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
            <div className="flex flex-1 flex-col gap-6">
                {sidebarLinks.map(({ imgURL, label, route }) => {
                    const isActive =
                        (pathname.includes(route) && route.length > 1) ||
                        pathname === route;

                    if (route === "/profile") {
                        if (!clerkId) {
                            return null;
                        }

                        route = `/profile/${clerkId}`;
                    }

                    return (
                        <Link
                            key={route}
                            href={route}
                            className={`flex items-center justify-start gap-4 rounded-lg bg-transparent p-4 ${isActive ? "primary-gradient text-light-900" : "text-dark300_light900"} hover:bg-light-800 dark:hover:bg-dark-300`}
                        >
                            <Image
                                src={imgURL}
                                alt={label}
                                width={20}
                                height={20}
                                className={`${isActive ? "" : "invert-colors"}`}
                            />
                            <p
                                className={`${isActive ? "base-bold" : "base-medium"} line-clamp-1 max-lg:hidden`}
                            >
                                {label}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default LeftSidebar;
