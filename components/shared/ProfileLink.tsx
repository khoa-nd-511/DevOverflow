import { Link } from "lucide-react";
import Image from "next/image";
import React from "react";

interface IProfileLinkProps {
    title: string;
    imgURL: string;
    href?: string;
}

const ProfileLink = ({ imgURL, title, href }: IProfileLinkProps) => {
    return (
        <div className="flex-center gap-1">
            <Image src={imgURL} alt="icon" width={20} height={20} />
            {href ? (
                <Link
                    href={href}
                    target="_blank"
                    className="paragraph-medium text-accent-blue"
                >
                    {title}
                </Link>
            ) : (
                <p className="paragraph-medium text-dark400_light700">
                    {title}
                </p>
            )}
        </div>
    );
};

export default ProfileLink;
