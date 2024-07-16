"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/answer.action";

interface IEditDeleteButtonsProps {
    id: string;
    type: "question" | "answer";
}

const EditDeleteButtons = ({ type, id }: IEditDeleteButtonsProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/question/${id}/edit`);
    };
    const handleDelete = async () => {
        if (type === "question") {
            await deleteQuestion({ pathname, questionId: id });
        } else if (type === "answer") {
            await deleteAnswer({ pathname, answerId: id });
        }
    };

    return (
        <div className="flex items-center justify-end gap-3 max-sm:w-full">
            {type === "question" && (
                <Image
                    src="/assets/icons/edit.svg"
                    alt="Edit"
                    width={14}
                    height={14}
                    className="cursor-pointer object-contain"
                    onClick={handleEdit}
                />
            )}
            <Image
                src="/assets/icons/trash.svg"
                alt="Delete"
                width={14}
                height={14}
                className="cursor-pointer object-contain"
                onClick={handleDelete}
            />
        </div>
    );
};

export default EditDeleteButtons;
