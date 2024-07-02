import React from "react";
import Link from "next/link";

import { Button } from "../ui/button";

interface IAskQuestionButtonProps {
  otherClasses?: string;
}

const AskQuestionButton = ({ otherClasses = "" }: IAskQuestionButtonProps) => {
  return (
    <Link href="/ask-question">
      <Button
        className={`paragraph-medium min-h-[42px] rounded-lg bg-primary-500 text-light-900 hover:bg-primary-500 ${otherClasses}`}
      >
        Ask a question
      </Button>
    </Link>
  );
};

export default AskQuestionButton;
