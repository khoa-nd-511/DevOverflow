import Image from "next/image";
import React from "react";
import Tag from "../shared/Tag";
import { getTopInteractedTags } from "@/lib/actions/tag.action";

interface IUserCardProps {
  id: string;
  imgURL: string;
  name: string;
  username: string;
}

const UserCard = async ({ id, imgURL, name, username }: IUserCardProps) => {
  const tags = await getTopInteractedTags({ userId: id });
  return (
    <div className="card-wrapper w-full rounded-lg p-9 sm:w-[260px] sm:p-11">
      <div className="flex flex-col items-center gap-6">
        <Image
          src={imgURL}
          width={100}
          height={100}
          alt="Profile picture"
          className="rounded-full"
        />

        <h3 className="h3-bold text-dark100_light900 line-clamp-1">{name}</h3>

        <p className="body-regular text-dark400_light500">@{username}</p>

        <div className="flex flex-wrap gap-2">
          {tags.map(({ _id, name }) => (
            <Tag key={_id} _id={_id} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
