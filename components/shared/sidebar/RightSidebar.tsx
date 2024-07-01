"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import Tag from "../Tag";

const questions = [
  {
    _id: "1",
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
  },
  {
    _id: "2",
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
  },
  {
    _id: "3",
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
  },
  {
    _id: "4",
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
  },
  {
    _id: "5",
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
  },
];
const tags = [
  {
    _id: "1",
    name: "NextJS",
    totalQuestions: 30,
  },
  {
    _id: "2",
    name: "ReactJS",
    totalQuestions: 10,
  },
  {
    _id: "3",
    name: "CSS",
    totalQuestions: 5,
  },
  {
    _id: "4",
    name: "HTML",
    totalQuestions: 3,
  },
];

const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div className="flex flex-1 flex-col gap-6">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {questions.map(({ _id, title }) => {
            return (
              <Link
                key={_id}
                href={`/questions/${_id}`}
                className="flex cursor-pointer items-center justify-between gap-7"
              >
                <p className="body-medium text-dark500_light700">{title}</p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-16 flex flex-1 flex-col gap-6">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {tags.map((tag) => {
            return <Tag key={tag._id} {...tag} showCount />;
          })}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
