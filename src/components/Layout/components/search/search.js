// import algoliasearch and InstantSearch
import algoliasearch from "algoliasearch/lite"
import { InstantSearch } from "react-instantsearch-dom"
import SearchBox from "./searchbox.js"
import Hits from"./hits.js"


// Initialize the Algolia client
const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
)


function search() {

return (
        <>
            <InstantSearch
                searchClient={searchClient}  
                indexName="posts"  
            >
                <SearchBox />
                <Hits />
            </InstantSearch>
        </>
    )
}

export default search;