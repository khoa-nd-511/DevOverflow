import Image from "next/image";
import React, { ReactNode } from "react";

interface INoResultsProps {
  title: string;
  description: string;
  cta?: ReactNode;
}

const NoResults = ({ title, description, cta }: INoResultsProps) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        alt="no results"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="no results"
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />

      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>

      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {description}
      </p>

      {cta}
    </div>
  );
};

export default NoResults;
