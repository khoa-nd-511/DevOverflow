import UserCard from "@/components/cards/UserCard";
import CTAButton from "@/components/shared/CTAButton";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { searchParamsSchema } from "@/lib/validations";
import React from "react";

const Community = async ({ searchParams }: { searchParams: unknown }) => {
    const parsedSearchParams = searchParamsSchema.parse(searchParams);

    const { users } = await getAllUsers({
        searchQuery: parsedSearchParams.q,
        filter: parsedSearchParams.filter,
    });

    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between sm:flex-row">
                <h1 className="h1-bold text-dark100_light900 max-sm:mt-6">
                    All Users
                </h1>
            </div>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route="/community"
                    placeholder="Enter user name to search..."
                    otherClasses="flex-1"
                />

                <Filter
                    filters={UserFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <div className="mt-10 flex w-full flex-wrap gap-6">
                {users.length > 0 ? (
                    users.map(({ _id, name, username, picture }) => {
                        return (
                            <UserCard
                                key={_id as string}
                                id={_id as string}
                                name={name}
                                username={username}
                                imgURL={picture}
                            />
                        );
                    })
                ) : (
                    <NoResults
                        title="Uh oh"
                        description="Be the first one to sign up and ask a question !!!"
                        cta={<CTAButton href="sign-up" label="Sign Up" />}
                    />
                )}
            </div>
        </>
    );
};

export default Community;
