 
import { connectSearchBox } from "react-instantsearch-dom"

function SearchBox({ refine }) {
    return (
        <> <section className= "container page-block search-box">
  
            
            <input
                id="algolia_search"
                type="search"
                placeholder="Search Waiheke Radio"
                onChange={(e) => refine(e.currentTarget.value)}
            />

          
            </section>
        </>
    )
}

export default connectSearchBox(SearchBox)