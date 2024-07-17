"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { updateUser } from "@/lib/actions/user.action";

const userFormSchema = z.object({
    name: z.string().min(5).max(50),
    username: z.string().min(5).max(50),
    location: z.string().optional(),
    bio: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
});

interface IProfileFormProps extends z.infer<typeof userFormSchema> {
    id: string;
}

const ProfileForm = ({
    id,
    name,
    username,
    location,
    bio,
    website,
}: IProfileFormProps) => {
    const { toast } = useToast();

    const pathname = usePathname();
    const router = useRouter();

    const form = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: name || "",
            username: username || "",
            location: location || "",
            bio: bio || "",
            website: website || "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
        try {
            await updateUser({
                clerkId: id,
                payload: values,
                pathname,
            });

            toast({
                description: "User's profile is updated successfully.",
                className:
                    "background-light900_dark300 text-dark100_light900 border-none shadow-light100_darknone",
            });

            router.push(`/profile/${id}`);
        } catch (error) {
            console.error("Unable to edit user profile", error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-10 space-y-8"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Name <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl className="mt-1">
                                <Input
                                    className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700"
                                    placeholder="Enter your name..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Username{" "}
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl className="mt-1">
                                <Input
                                    className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700"
                                    placeholder="Where are you from..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Location
                            </FormLabel>
                            <FormControl className="mt-1">
                                <Input
                                    className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700"
                                    placeholder="Where are you from..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Bio
                            </FormLabel>
                            <FormControl className="mt-1">
                                <Textarea
                                    className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700"
                                    placeholder="Tell us  more about your self..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Website
                            </FormLabel>
                            <FormControl className="mt-1">
                                <Input
                                    className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700"
                                    placeholder="Enter your porfolio website..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="paragraph-medium primary-gradient ml-auto min-h-[46px] rounded-lg text-white"
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </Form>
    );
};

export default ProfileForm;
