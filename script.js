// stores all articles from .json
// keep this outside functions so the search can access articles later
let allArticles = [];
let selectedCategory = null;                // this will remember which category button in search bar is active
let selectedTag = null;                     // this will remember which tag button in search bar is active

// get references to HTML sections, is where cards will appear
const featuredContainer = document.getElementById("featured-container");
const latestContainer = document.getElementById("latest-container");

const searchResults = document.getElementById("search-results");
const searchContainer = document.getElementById("search-container");

const tagContainer = document.getElementById("tag-filters");

const noResults = document.getElementById("no-results");

// load the article data from .json
fetch("articles.json")
    .then(response => response.json())
    .then(articles => {
        
        // save all articles into variable
        allArticles = articles;
        // display articles when the page loads
        displayArticles(allArticles);

        // ------------------------------------------------------------------------------------
        // SEARCH FUNCTION
        // ------------------------------------------------------------------------------------
    
        // find search input box
        const searchBox = document.getElementById("search-box");
     
        // this runs every time user types something
        searchBox.addEventListener("input", function () {
            updateSearchResults();
        });

        // convert search text to lowercase
        const searchTerm = searchBox.value.toLowerCase();

        // if the search box is empty, hide search results and remove old cards
        if (searchTerm === "") {
            searchResults.style.display = "none";
            searchContainer.innerHTML = "";
            return;
        }

        // look through all articles and keep only matching ones
        const filteredArticles = allArticles.filter(article => {

            return (
                article.title.toLowerCase().includes(searchTerm) ||             //searches titles
                article.category.some(category =>
                    category.toLowerCase().includes(searchTerm)) ||          //searches categories
                article.tags.some(tag =>                                        //searches tags
                    tag.toLowerCase().includes(searchTerm)
                )  
            );
        });

        // show search results section
        searchResults.style.display = "block";

        // if there are no matches
        if (filteredArticles.length === 0) {
            searchContainer.innerHTML = "";
            noResults.style.display = "block";
            noResults.textContent =
                `No articles found matching "${searchBox.value}"`;
        }

        // if matches found, display card(s) underneath
        else {
            noResults.style.display = "none";
            displayCards(filteredArticles, searchContainer);
        }
    });

// ------------------------------------------------------------------------------------
// CARD TEMPLATE
// creates ONE article card using .json metadata, any section can use it
// ------------------------------------------------------------------------------------
function createCard(article) {

    return `

        <a href="${article.link}" class="article-card">
            <img src="${article.image}" alt="">

            <div class="article-content">

                <h3>${article.title}</h3>
                <p>${article.description}</p>

                <div class="card-footer">

                    ${article.category.map(category => `
                        <span class="category-badge ${category.toLowerCase()}">
                        ${category}
                        </span>
                    `).join("")}
                    <span class="article-date">
                        ${article.displayDate}
                    </span>

                </div>
                
            </div>

        </a>
    `;
}

// ------------------------------------------------------------------------------------
// HOMEPAGE ARTICLES
// creates Featured and Latest article sections
// ------------------------------------------------------------------------------------
function displayArticles(articles) {

    // clear old cards before adding new ones, prevents duplicates
    featuredContainer.innerHTML = "";
    latestContainer.innerHTML = "";

    // go through every article in .json
    articles.forEach(article => {

        // create card once
        const card = createCard(article);

        // put all articles in Latest
        latestContainer.innerHTML += card;

        // put featured articles in Featured
        if (article.featured) {
            featuredContainer.innerHTML += card;
        }
    });
};

// ------------------------------------------------------------------------------------
// SEARCH FUNCTION
// uses the same card creator as Featured/Latest
// ------------------------------------------------------------------------------------

// ------------------------------------------
// make tags appear when parent category active
// ------------------------------------------

function displayTags(category) {

    tagContainer.innerHTML = "";

    // no category selected = hide tags
    if (category === null) {
        return;
    }

    // find all articles in this category
    const categoryArticles = allArticles.filter(article =>
        article.category.includes(category)
    );

    // collect unique tags
    const tags = [];

    categoryArticles.forEach(article => {
    if (article.tags[category]) {
        article.tags[category].forEach(tag => {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        });
    }
});

    // create buttons
    tags.forEach(tag => {

        const button = document.createElement("button");
        button.textContent = tag;
        button.dataset.tag = tag;

        button.classList.add("tag-button");
        button.classList.add(category.toLowerCase());

        button.addEventListener("click", function () {

            // clicking active tag turns it off
            if (this.classList.contains("active")) {
                this.classList.remove("active");
                selectedTag = null;
            } 
            else {
                // remove active from other tags
                document
                .querySelectorAll("#tag-filters button")
                .forEach(btn => btn.classList.remove("active"));

                this.classList.add("active");
                selectedTag = tag;
            }
            
            updateSearchResults();
        });
        
        tagContainer.appendChild(button);

    });
}

// ------------------------------------------
// display search result
// ------------------------------------------

function displayCards(articles, container) {

    // remove previous search results
    container.innerHTML = "";

    // create a card for every matching article
    articles.forEach(article => {
        container.innerHTML += createCard(article);
    });
}

// ------------------------------------------
// make search query and catgory buttons work together
// ------------------------------------------

function updateSearchResults() {

    const searchTerm = document
        .getElementById("search-box")
        .value
        .toLowerCase();

    let filteredArticles = allArticles;

    // filter by category
    if (selectedCategory !== null) {
        filteredArticles = filteredArticles.filter(article =>
            article.category.includes(selectedCategory)

        );
    }

    if (selectedTag !== null) {
        filteredArticles = filteredArticles.filter(article =>
            article.tags.includes(selectedTag)
        );
    }

    // filter by search text
    if (searchTerm !== "") {
        filteredArticles = filteredArticles.filter(article =>
            article.title.toLowerCase().includes(searchTerm) ||
            article.category.some(category =>
                category.toLowerCase().includes(searchTerm)) ||
            article.tags.some(tag =>
                tag.toLowerCase().includes(searchTerm)

            )
        );
    }

    // nothing selected?
    if (searchTerm === "" && selectedCategory === null) {
        searchResults.style.display = "none";
        searchContainer.innerHTML = "";
        noResults.style.display = "none";
        return;
    }

    searchResults.style.display = "block";

    if (filteredArticles.length === 0) {
        searchContainer.innerHTML = "";
        noResults.style.display = "block";
        noResults.textContent = "No matching articles.";

    } else {
        noResults.style.display = "none";
        displayCards(filteredArticles, searchContainer);
    }

}

// ------------------------------------------
// category buttons
// ------------------------------------------

const filterButtons = document.querySelectorAll(".filters button");

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        // clicking the active button turns it off
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            selectedCategory = null;
            selectedTag = null;
            displayTags(null);
        }

        else {
            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );
            
            this.classList.add("active");
            selectedCategory = this.dataset.category;
            selectedTag = null;
            displayTags(selectedCategory);
        }

        updateSearchResults();

    });
});