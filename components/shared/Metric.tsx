import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IMetricProps {
  imgURL: string;
  alt: string;
  value: number | string;
  title: string;
  href?: string;
  isAuthor?: boolean;
  otherClasses?: string;
}

const Metric = ({
  imgURL,
  alt,
  title,
  value,
  otherClasses = "",
  href,
  isAuthor,
}: IMetricProps) => {
  const content = (
    <>
      <Image
        src={imgURL}
        width={16}
        height={16}
        alt={alt}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${otherClasses} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-2">
        {content}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-2">{content}</div>;
};

export default Metric;
