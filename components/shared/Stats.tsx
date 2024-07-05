import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface IStatsProps {
    totalQuestions: number;
    totalAnswers: number;
}

interface IStatCardProps {
    imgURL: string;
    value: number;
    title: string;
}

const StatCard = ({ imgURL, title, value }: IStatCardProps) => {
    return (
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-lime-300 dark:shadow-dark-200">
            <Image src={imgURL} width={40} height={50} alt="badge" />
            <div>
                <p className="paragraph-semibold text-dark200_light900">
                    {value}
                </p>
                <p className="body-medium text-dark400_light700">{title}</p>
            </div>
        </div>
    );
};

const Stats = ({ totalAnswers, totalQuestions }: IStatsProps) => {
    return (
        <div className="mt-10">
            <h4 className="h3-semibold text-dark200_light900">Stats</h4>

            <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
                <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-lime-300 dark:shadow-dark-200">
                    <div>
                        <p className="paragraph-semibold text-dark200_light900">
                            {formatNumber(totalQuestions)}
                        </p>
                        <p className="body-medium text-dark400_light700">
                            Question{totalQuestions > 1 ? "s" : ""}
                        </p>
                    </div>
                    <div>
                        <p className="paragraph-semibold text-dark200_light900">
                            {formatNumber(totalAnswers)}
                        </p>
                        <p className="body-medium text-dark400_light700">
                            Answer{totalAnswers > 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                <StatCard
                    imgURL="/assets/icons/gold-medal.svg"
                    value={0}
                    title="Gold Badges"
                />
                <StatCard
                    imgURL="/assets/icons/silver-medal.svg"
                    value={0}
                    title="Silver Badges"
                />
                <StatCard
                    imgURL="/assets/icons/bronze-medal.svg"
                    value={0}
                    title="Bronze Badges"
                />
            </div>
        </div>
    );
};

export default Stats;
