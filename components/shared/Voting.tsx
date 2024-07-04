"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import {
    downvoteQuestion,
    saveQuestion,
    upvoteQuestion,
} from "@/lib/actions/question.action";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";

const noop = () => {};

const apiMap = {
    question: {
        upvote: upvoteQuestion,
        downvote: downvoteQuestion,
        save: saveQuestion,
    },
    answer: {
        upvote: upvoteAnswer,
        downvote: downvoteAnswer,
        save: noop,
    },
} as const;

type VotingType = keyof typeof apiMap;
type VotingAction = keyof (typeof apiMap)[VotingType];

interface IVotingProps {
    id: string;
    userId: string;
    type: VotingType;
    upvotes: number;
    downvotes: number;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    hasSaved?: boolean;
}

const Voting = ({
    id,
    type,
    userId,
    downvotes,
    upvotes,
    hasDownvoted,
    hasSaved = false,
    hasUpvoted,
}: IVotingProps) => {
    const pathname = usePathname();

    const [voting, setVoting] = useState(false);

    const handleVote = (action: VotingAction) => async () => {
        if (voting) return;
        setVoting(true);
        try {
            const api = apiMap[type][action];

            await api({
                id,
                userId,
                hasDownvoted,
                hasUpvoted,
                hasSaved,
                pathname,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setVoting(false);
        }
    };

    return (
        <div className="flex justify-end gap-4">
            <Button
                className="flex gap-2 p-0 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100"
                disabled={voting}
                onClick={handleVote("upvote")}
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
                <Badge className="btn text-dark100_light900 rounded-md">
                    {formatNumber(upvotes)}
                </Badge>
            </Button>
            <Button
                className="flex gap-2 p-0 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100"
                disabled={voting}
                onClick={handleVote("downvote")}
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
                <Badge className="btn text-dark100_light900 rounded-md">
                    {formatNumber(downvotes)}
                </Badge>
            </Button>
            {type === "question" && (
                <Button
                    className="p-0 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100"
                    disabled={voting}
                    onClick={handleVote("save")}
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
            )}
        </div>
    );
};

export default Voting;
