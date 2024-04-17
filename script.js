const searchForm = document.querySelector(".js-search-form");
const searchResults = document.querySelector(".js-search-results");
const spinner = document.querySelector(".js-spinner");


searchForm.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();

    const searchInputValue = document.querySelector(".js-search-input").value;
    const searchQuery = searchInputValue.trim();
    
    searchResults.innerHTML = '';
    
    spinner.classList.remove('hidden');
    try {
        const results = await searchWikipedia(searchQuery);
        displayResults(results);
        console.log(results);
        if(results.query.searchinfo.totalhits === 0) {
            alert("No results found.");
            return;
        }
    } catch(err) {
        console.log(err);
        alert("Failed to search wikipedia");
    } finally {
        spinner.classList.add('hidden');
    }
}

async function searchWikipedia(searchQuery) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    const response = await fetch(endpoint);

    if(!response.ok) {
        throw Error(response.statusText);
    }

    const json = await response.json();
    return json;
}

function displayResults(results) {
    results.query.search.forEach(result => {
        const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

        searchResults.insertAdjacentHTML(
            'beforeend',
            `<div class="result-item">
                <h3 class="result-title">
                    <a href="${url}" target="_blank" rel="noopenner">${result.title}</a>
                </h3>
                <a class="result-link" href="${url}" target="_blank" rel="noopenner">${url}</a>
                <span class="result-snippet">${result.snippet}</span><br>
            </div>`
        );
    });
}