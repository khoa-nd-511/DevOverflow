import * as z from "zod";

export const askQuestionFormSchema = z.object({
    title: z.string().min(5).max(130),
    description: z.string().min(100),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const answerFormSchema = z.object({
    content: z.string().min(100),
});

export const searchParamsSchema = z.object({
    q: z.string().catch(""),
    filter: z.string().catch(""),
});
