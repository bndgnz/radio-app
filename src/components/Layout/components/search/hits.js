import { connectStateResults } from "react-instantsearch-dom"

function Hits({ searchState, searchResults }) {
const validQuery = searchState.query?.length >= 3  

function Resolver ()
{



}







 


    return (
        <> 
            {searchResults?.hits.length === 0 && validQuery && (
                <p>No results found!</p>
            )}

            {searchResults?.hits.length > 0 && validQuery && (
                <>
                    {searchResults.hits.map((hit, index) => (
                        <div tabIndex={index} key={hit.objectID} className="search-results">
                            <h3>{hit.fields.title[["en-US"]]}</h3>
                             <Resolver data={hit} />
                              

                        </div>
                    ))}
                </>
            )}
        </>
    )
}

export default connectStateResults(Hits)