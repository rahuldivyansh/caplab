import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const QueryContext = createContext(null);

export const useQuery = () => useContext(QueryContext)

const QueryProvider = ({ children }) => {
    const [query, setQuery] = useState(null);
    const router = useRouter();
    useEffect(() => {
        const { asPath } = router;
        const PATH_MATCHER_REGEX = /(\w+=[\w\.\-]+)(&\w+=[\w\.\-]+)*/
        const pathMatcher = new RegExp(PATH_MATCHER_REGEX);
        if (asPath.startsWith("/#") && asPath.length > 2) {
            const queriesString = asPath.substring(2);
            console.log(queriesString)
            if (pathMatcher.test(queriesString)) {
                const queriesTuple = queriesString.split("&");
                const queries = {};
                queriesTuple.forEach(query => {
                    const [key, value] = query.split("=");
                    queries[key] = value;
                });
                setQuery(queries);
            } else {
                toast("not matched")
            }
        }
    }, [])
    return <QueryContext.Provider value={query}>{children}</QueryContext.Provider>
}

export default QueryProvider;
