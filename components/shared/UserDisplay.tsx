import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

interface IUserDisplayProps {
    id: string;
    name: ReactNode;
    imgURL: string;
    imgSize?: number;
}

const UserDisplay = ({ id, name, imgURL, imgSize = 22 }: IUserDisplayProps) => {
    return (
        <Link
            href={`/profile/${id}`}
            className="flex w-full items-center justify-start gap-1"
        >
            <Image
                src={imgURL}
                width={imgSize}
                height={imgSize}
                alt="Profile picture"
                className="rounded-full"
            />
            <div className="paragraph-semibold text-dark300_light700">
                {name}
            </div>
        </Link>
    );
};

export default UserDisplay;
