"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.log(error.message);
    }, [error]);

    return (
        <div className="mt-20 flex flex-col items-center">
            <h1 className="h1-bold">Something went wrong!</h1>
            <Link href="/" className="text-primary-500">
                Click here to go back to home page
            </Link>
        </div>
    );
}
