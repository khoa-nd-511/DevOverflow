import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getTimestamp(date: Date): string {
    const now = new Date();
    const elapsed = now.getTime() - date.getTime();

    const seconds = Math.floor(elapsed / 1000);
    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? "" : "s"} ago`;
}

export function formatNumber(num: number): string {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
}

export function getJoinedDate(date: Date) {
    if (!(date instanceof Date)) {
        throw new Error("Invalid input: expected a Date object");
    }

    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${month} ${year}`;
}

interface IConstructURLFromQueryStringParams {
    searchParams: string;
    key: string;
    value: string | null;
}

export function constructURLFromQueryString({
    key,
    searchParams,
    value,
}: IConstructURLFromQueryStringParams) {
    const parsed = qs.parse(searchParams);
    parsed[key] = value;
    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query: parsed,
        },
        { skipEmptyString: true }
    );
}
