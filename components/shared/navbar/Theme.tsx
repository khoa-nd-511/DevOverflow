import React from "react";
import Image from "next/image";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { useTheme } from "@/context/ThemeProvider";
import { themes } from "@/constants";

const Theme = () => {
    const { mode, setMode } = useTheme();

    return (
        <Menubar className="relative border-none bg-transparent shadow-none">
            <MenubarMenu>
                <MenubarTrigger className="flex size-[40px] cursor-pointer rounded-full p-0 focus:bg-light-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
                    {mode === "light" ? (
                        <Image
                            src="/assets/icons/sun.svg"
                            alt="Sun"
                            width={20}
                            height={20}
                            className="active-theme m-auto"
                        />
                    ) : (
                        <Image
                            src="/assets/icons/moon.svg"
                            alt="Moon"
                            width={20}
                            height={20}
                            className="active-theme m-auto"
                        />
                    )}
                </MenubarTrigger>
                <MenubarContent className="background-light900_dark200 absolute -right-12 mt-3 min-w-[120px] rounded border py-2 dark:border-dark-400 dark:bg-dark-300">
                    {themes.map(({ icon, label, value }, index) => {
                        return (
                            <MenubarItem
                                key={value}
                                className="flex items-center gap-4 px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400"
                                autoFocus
                                onClick={() => {
                                    setMode(value);
                                    if (value !== "system") {
                                        localStorage.theme = value;
                                    } else {
                                        localStorage.removeItem("theme");
                                    }
                                }}
                            >
                                <Image
                                    src={icon}
                                    alt={value}
                                    className={
                                        value === mode ? "active-theme" : ""
                                    }
                                    width={16}
                                    height={16}
                                />
                                <p
                                    className={`body-semibold text-light-500 ${value === mode ? "text-primary-500" : "text-dark100_light900"}`}
                                >
                                    {label}
                                </p>
                            </MenubarItem>
                        );
                    })}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default Theme;
