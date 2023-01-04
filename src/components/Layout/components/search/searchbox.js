 
import { connectSearchBox } from "react-instantsearch-dom"

function SearchBox({ refine }) {
    return (
        <>
            <input
                id="algolia_search"
                type="search"
                placeholder="Search for articles!"
                onChange={(e) => refine(e.currentTarget.value)}
            />
        </>
    )
}

export default connectSearchBox(SearchBox)