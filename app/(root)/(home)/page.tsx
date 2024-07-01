import React from "react";

import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { HomePageFilters } from "@/constants/filters";
import QuestionCard from "@/components/cards/QuestionCard";
import AskQuestionButton from "@/components/shared/AskQuestionButton";

const questions = [
  {
    _id: "1",
    title: "How to learn TypeScript?",
    tags: [
      { _id: "t1", name: "TypeScript" },
      { _id: "t2", name: "Programming" },
    ],
    author: {
      _id: "a1",
      name: "John Doe",
      picture: "/assets/icons/avatar.svg",
    },
    upvotes: 10,
    views: 1500000,
    answers: [
      {
        text: "You can learn TypeScript by following official documentation and practicing regularly.",
      },
      { text: "Another answer: Enroll in online courses and build projects." },
    ],
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "What are the best practices for React hooks?",
    tags: [
      { _id: "t3", name: "React" },
      { _id: "t4", name: "Hooks" },
    ],
    author: {
      _id: "a2",
      name: "Jane Smith",
      picture: "/assets/icons/avatar.svg",
    },
    upvotes: 8,
    views: 123432,
    answers: [
      {
        text: "One of the best practices is to keep hooks at the top level and never inside loops or conditions.",
      },
      { text: "Another answer: Use custom hooks to abstract complex logic." },
    ],
    createdAt: new Date("2024-07-01"),
  },
  {
    _id: "3",
    title: "What is the difference between let and var in JavaScript?",
    tags: [
      { _id: "t5", name: "JavaScript" },
      { _id: "t6", name: "ES6" },
    ],
    author: {
      _id: "a3",
      name: "Alice Johnson",
      picture: "/assets/icons/avatar.svg",
    },
    upvotes: 15,
    views: 150,
    answers: [
      {
        text: "The main difference is scope. 'var' is function-scoped, while 'let' is block-scoped.",
      },
      { text: "Another answer: 'let' also helps avoid issues with hoisting." },
    ],
    createdAt: new Date("2023-04-10"),
  },
  {
    _id: "4",
    title: "How do you manage state in a React application?",
    tags: [
      { _id: "t3", name: "React" },
      { _id: "t7", name: "State Management" },
    ],
    author: {
      _id: "a4",
      name: "Bob Brown",
      picture: "/assets/icons/avatar.svg",
    },
    upvotes: 12,
    views: 120,
    answers: [
      {
        text: "You can use built-in hooks like useState and useReducer for managing state.",
      },
      {
        text: "Another answer: Consider using state management libraries like Redux or MobX for complex state.",
      },
    ],
    createdAt: new Date("2023-03-05"),
  },
  {
    _id: "5",
    title: "What are some common mistakes in JavaScript?",
    tags: [
      { _id: "t5", name: "JavaScript" },
      { _id: "t8", name: "Programming" },
    ],
    author: {
      _id: "a5",
      name: "Charlie Green",
      picture: "/assets/icons/avatar.svg",
    },
    upvotes: 20,
    views: 200,
    answers: [
      {
        text: "Common mistakes include not understanding asynchronous code and not handling errors properly.",
      },
      {
        text: "Another answer: Avoid using '==', always use '===' for comparisons.",
      },
    ],
    createdAt: new Date("2023-02-25"),
  },
];

const page = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row">
        <h1 className="h1-bold text-dark100_light900 max-sm:mt-6">
          All Questions
        </h1>

        <AskQuestionButton />
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch placeholder="Search questions" />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[65px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} {...question} />
          ))
        ) : (
          <NoResults
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            cta={<AskQuestionButton otherClasses="mt-5" />}
          />
        )}
      </div>
    </>
  );
};

export default page;
