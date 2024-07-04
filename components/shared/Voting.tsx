"use client";

import React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

interface IVotingProps {
    id: string;
    userId: string;
    type: "question" | "answer";
    upvotes: number;
    downvotes: number;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    hasSaved: boolean;
}

const Voting = ({
    downvotes,
    upvotes,
    id,
    hasDownvoted,
    hasSaved,
    hasUpvoted,
}: IVotingProps) => {
    return (
        <div className="flex justify-end gap-4">
            <Button
                className="flex gap-2 p-0"
                onClick={() => {
                    console.log("upvote", id);
                }}
            >
                <Image
                    src={
                        hasUpvoted
                            ? "/assets/icons/upvoted.svg"
                            : "/assets/icons/upvote.svg"
                    }
                    width={18}
                    height={18}
                    alt="Upvote"
                />
                <Badge className="btn rounded-md">
                    {formatNumber(upvotes)}
                </Badge>
            </Button>
            <Button
                className="flex gap-2 p-0"
                onClick={() => {
                    console.log("downvote", id);
                }}
            >
                <Image
                    src={
                        hasDownvoted
                            ? "/assets/icons/downvoted.svg"
                            : "/assets/icons/downvote.svg"
                    }
                    width={18}
                    height={18}
                    alt="Downvote"
                />
                <Badge className="btn rounded-md">
                    {formatNumber(downvotes)}
                </Badge>
            </Button>
            <Button
                className="p-0"
                onClick={() => {
                    console.log("downvote", id);
                }}
            >
                <Image
                    src={
                        hasSaved
                            ? "/assets/icons/star-filled.svg"
                            : "/assets/icons/star-red.svg"
                    }
                    width={18}
                    height={18}
                    alt="Star"
                />
            </Button>
        </div>
    );
};

export default Voting;
