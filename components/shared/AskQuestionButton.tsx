import React from "react";
import Link from "next/link";

import { Button } from "../ui/button";

interface ICTAButtonProps {
  href: string;
  label: string;
  otherClasses?: string;
}

const CTAButton = ({ label, href, otherClasses = "" }: ICTAButtonProps) => {
  return (
    <Link href={href}>
      <Button
        className={`paragraph-medium min-h-[42px] rounded-lg bg-primary-500 text-light-900 hover:bg-primary-500 ${otherClasses}`}
      >
        {label}
      </Button>
    </Link>
  );
};

export default CTAButton;
