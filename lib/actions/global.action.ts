"use server";

import { Model } from "mongoose";
import { QuestionModel, TagModel, UserModel } from "@/database";

import { connectToDB } from "../mongoose";
import { IGlobalSearchParams, TGlobalResult } from "./shared.types";

const SupportedTypes = new Set(["question", "answer", "user", "tag"]);

type TSearchModel = {
    type: string;
    field: string;
    model: Model<any>;
};

const SearchModels: TSearchModel[] = [
    { type: "question", field: "title", model: QuestionModel },
    // { type: "answer", field: "content", model: AnswerModel },
    { type: "user", field: "name", model: UserModel },
    { type: "tag", field: "name", model: TagModel },
];

export async function globalSearch(
    params: IGlobalSearchParams
): Promise<TGlobalResult[]> {
    try {
        await connectToDB();

        const { type, query } = params;
        const regexQuery = { $regex: new RegExp(query, "i") };

        let searchType = type;

        if (searchType) {
            searchType = searchType.toLocaleLowerCase();
        }

        if (!searchType || !SupportedTypes.has(searchType)) {
            const results = [];
            for (const { field, model, type } of SearchModels) {
                const queryResults = await model
                    .find({
                        [field]: regexQuery,
                    })
                    .limit(2);
                results.push(
                    ...queryResults.map((result) => ({
                        id:
                            type === "user"
                                ? result.clerkId
                                : type === "answer"
                                  ? result.question
                                  : result.id,
                        title: result[field],
                        type,
                    }))
                );
            }
            return results;
        } else {
            // search base on selected type
            const modelInfo = SearchModels.find(
                ({ type }) => type === searchType
            );
            if (!modelInfo) {
                throw new Error("Invalid search type");
            }
            const { field, model, type } = modelInfo;

            const results = await model
                .find({
                    [field]: regexQuery,
                })
                .limit(8);

            return results.map((result) => ({
                id:
                    type === "user"
                        ? result.clerkId
                        : type === "answer"
                          ? result.question
                          : result.id,
                title:
                    type === "answer"
                        ? `Answers containing "${query}"`
                        : result[field],
                type,
            }));
        }
    } catch (error) {
        console.error("unable to perform global search", error);
        throw error;
    }
}
