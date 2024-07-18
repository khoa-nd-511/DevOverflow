import { useSearchParams } from "next/navigation";
import { searchParamsSchema } from "./validations";

export function useParsedSearchParams() {
    const searchParams = useSearchParams();
    const parsedSearchParams = searchParamsSchema.parse({
        q: searchParams.get("q"),
        g: searchParams.get("g"),
        filter: searchParams.get("filter"),
        type: searchParams.get("type"),
    });
    return {
        ...parsedSearchParams,
        searchParamsString: searchParams.toString(),
    };
}
