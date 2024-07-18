"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { answerFormSchema } from "@/lib/validations";
import { useTheme } from "@/context/ThemeProvider";
import { createAnswer } from "@/lib/actions/answer.action";

import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

interface IAnswerFormProps {
    questionId: string;
    userId: string;
}

const AnswerForm = ({ questionId, userId }: IAnswerFormProps) => {
    const { mode } = useTheme();

    const pathname = usePathname();

    const editorRef = useRef<TinyMCEEditor>();

    const [submitting, setSubmitting] = useState(false);

    const form = useForm<z.infer<typeof answerFormSchema>>({
        resolver: zodResolver(answerFormSchema),
        defaultValues: {
            content: "",
        },
    });

    const handleAnswerSubmit = async ({
        content,
    }: z.infer<typeof answerFormSchema>) => {
        setSubmitting(true);

        try {
            await createAnswer({
                content,
                question: questionId,
                author: userId,
                pathname,
            });

            if (editorRef.current) {
                editorRef.current.setContent("");
            }

            form.reset();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <h4 className="paragraph-semibold text-dark400_light800">
                    Write your answer here
                </h4>

                <Button className="btn light-border-2 gap-2 rounded-md px-4 py-2 text-primary-500 shadow-none">
                    <Image
                        src="/assets/icons/stars.svg"
                        alt="star"
                        width={12}
                        height={12}
                        className="object-contain"
                    />
                    Generate AI Answer
                </Button>
            </div>

            <Form {...form}>
                <form
                    className="mt-5 flex w-full flex-col gap-10"
                    onSubmit={form.handleSubmit(handleAnswerSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col">
                                <FormControl className="mt-1">
                                    <Editor
                                        apiKey={
                                            process.env
                                                .NEXT_PUBLIC_TINY_EDITOR_API_KEY
                                        }
                                        onInit={(_evt, editor) => {
                                            // @ts-ignore
                                            editorRef.current = editor;
                                        }}
                                        onBlur={field.onBlur}
                                        onEditorChange={(content) =>
                                            field.onChange(content)
                                        }
                                        initialValue=""
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                "advlist",
                                                "autolink",
                                                "lists",
                                                "link",
                                                "image",
                                                "charmap",
                                                "preview",
                                                "anchor",
                                                "searchreplace",
                                                "visualblocks",
                                                "codesample",
                                                "fullscreen",
                                                "insertdatetime",
                                                "media",
                                                "table",
                                            ],
                                            toolbar:
                                                "undo redo | " +
                                                "codesample | bold italic forecolor | alignleft aligncenter " +
                                                "alignright alignjustify | bullist numlist",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                                            skin:
                                                mode === "dark"
                                                    ? "oxide-dark"
                                                    : "oxide",
                                            content_css:
                                                mode === "dark"
                                                    ? "dark"
                                                    : "light",
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="primary-gradient w-fit text-white"
                        >
                            {submitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};

export default AnswerForm;
