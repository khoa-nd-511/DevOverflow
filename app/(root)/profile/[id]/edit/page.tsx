import React from "react";
import { z } from "zod";
import { redirect } from "next/navigation";

import ProfileForm from "@/components/forms/ProfileForm";
import { getUserById } from "@/lib/actions/user.action";

const editProfilePageParamsSchema = z.object({
    id: z.string(),
});

const EditProfilePage = async ({ params }: { params: unknown }) => {
    const parsedParams = editProfilePageParamsSchema.safeParse(params);

    if (parsedParams.error) {
        redirect("/");
    }

    const {
        data: { id },
    } = parsedParams;

    const user = await getUserById({
        clerkId: id,
    });

    if (!user) {
        redirect("/");
    }

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

            <div className="mt-10">
                <ProfileForm
                    id={id}
                    name={user.name}
                    username={user.username}
                    location={user.location}
                    bio={user.bio}
                    website={user.website}
                />
            </div>
        </>
    );
};

export default EditProfilePage;
