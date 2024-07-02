import UserCard from "@/components/cards/UserCard";
import UsersFilter from "@/components/community/UsersFilter";
import Filter from "@/components/shared/Filter";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import React from "react";

const Community = async () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row">
        <h1 className="h1-bold text-dark100_light900 max-sm:mt-6">All Users</h1>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch placeholder="Enter user name to search..." />

        <Filter
          filters={UserFilters}
          otherClasses="m-h-[65px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <UsersFilter />

      <div className="mt-10 flex w-full flex-wrap gap-6">
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </div>
    </>
  );
};

export default Community;
