import Image from "next/image";
import React from "react";
import Tag from "../shared/Tag";

const UserCard = () => {
  return (
    <div className="card-wrapper min-w-[200px] flex-1 rounded-lg p-9 sm:p-11">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/assets/icons/avatar.svg"
          width={100}
          height={100}
          alt="Profile picture"
          className="invert-colors"
        />

        <h3 className="h3-bold text-dark100_light900 line-clamp-1">
          User&apos;s Name
        </h3>

        <p className="body-regular text-dark400_light500">@username</p>

        <div className="flex flex-wrap gap-2">
          {[
            { _id: "1", name: "NextJS" },
            { _id: "2", name: "ReactJS" },
            { _id: "3", name: "CSS" },
          ].map(({ _id, name }) => (
            <Tag key={_id} _id={_id} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
