"use client";

import React, { KeyboardEvent, useRef, useState } from "react";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { askQuestionFormSchema } from "@/lib/validations";
import { createQuestion } from "@/lib/actions/question.action";
import { useTheme } from "@/context/ThemeProvider";

let type = "edit";
type = "create";

interface IQuestionFormProps {
  mongoUserId: string;
}

const QuestionForm = ({ mongoUserId }: IQuestionFormProps) => {
  const { mode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const editorRef = useRef<Editor>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof askQuestionFormSchema>>({
    resolver: zodResolver(askQuestionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  // 2. Define a submit handler.
  const handleFormSubmit = async (
    values: z.infer<typeof askQuestionFormSchema>
  ) => {
    setIsSubmitting(true);

    try {
      await createQuestion({
        ...values,
        author: JSON.parse(mongoUserId),
        pathname,
      });

      router.push("/");
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDownEvent = (
    e: KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          form.setError("tags", {
            type: "required",
            message: "Tag must be less than or equal to 15 characters",
          });
        }
        if (!field.value.includes(tagValue)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemoval = (tag: string) => {
    const tags = form.getValues("tags").filter((t) => t !== tag);
    form.setValue("tags", tags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex w-full flex-col gap-10 space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-1">
                <Input
                  className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700"
                  placeholder="Enter question title..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Description <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-1">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(_evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
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
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-1">
                <>
                  <Input
                    className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 disabled:bg-slate-300"
                    placeholder="Enter up to 3 tags that are related to the question..."
                    onKeyDown={(e) => handleKeyDownEvent(e, field)}
                    disabled={field.value.length >= 3}
                  />

                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: string) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-dark400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                        >
                          {tag}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="close icon"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert"
                            onClick={() => handleTagRemoval(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="paragraph-medium primary-gradient min-h-[46px] rounded-lg text-white"
        >
          {isSubmitting ? (
            <>{type === "edit" ? "Editting..." : "Submitting..."}</>
          ) : (
            <>{type === "edit" ? "Edit" : "Submit"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
