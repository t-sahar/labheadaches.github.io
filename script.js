// Stores all articles from the JSON file.
// We keep this outside functions so the search can access the articles later.
let allArticles = [];

// Get references to HTML sections
// These are the places where cards will appear
const featuredContainer = document.getElementById("featured-container");
const latestContainer = document.getElementById("latest-container");

const searchResults = document.getElementById("search-results");
const searchContainer = document.getElementById("search-container");

const noResults = document.getElementById("no-results");

// Load the article data from articles.json
fetch("articles.json")
    .then(response => response.json())
    .then(articles => {

        // Save all articles into our variable
        allArticles = articles;
        // Display the articles when the page loads
        displayArticles(allArticles);

        // ------------------------------------------------------------------------------------
        // SEARCH FUNCTION
        // ------------------------------------------------------------------------------------
    
    
        // Find the search input box
        const searchBox = document.getElementById("search-box");
     
        // Runs every time the user types something
        searchBox.addEventListener("input", function() {
            console.log("Searching:", searchBox.value);

        // Convert search text to lowercase
        const searchTerm = searchBox.value.toLowerCase();

        // If the search box is empty, hide search results and remove old cards
        if (searchTerm === "") {
            searchResults.style.display = "none";
            searchContainer.innerHTML = "";
            return;
        }

        // Look through all articles and keep only matching ones
        const filteredArticles = allArticles.filter(article => {

            return (
                article.title.toLowerCase().includes(searchTerm) ||             //search titles
                article.category.toLowerCase().includes(searchTerm) ||          //search categories
                article.tags.some(tag =>                                        //search tags
                    tag.toLowerCase().includes(searchTerm)
                )  
            );
        });

        // Show the search results section
        searchResults.style.display = "block";

        // If there are no matches
        if (filteredArticles.length === 0) {
            searchContainer.innerHTML = "";
            noResults.style.display = "block";
            noResults.textContent =
                `No articles found matching "${searchBox.value}"`;
        }

        // If there are matches, display card(s) underneath
        else {
            noResults.style.display = "none";
            displayCards(filteredArticles, searchContainer);
        }
    });
});

// ------------------------------------------------------------------------------------
// CARD TEMPLATE
// Creates ONE article card, any section can use it.
// ------------------------------------------------------------------------------------
function createCard(article) {

    return `

        <a href="${article.link}" class="article-card">
            <img src="${article.image}" alt="">

            <div class="article-content">
                <h3>${article.title}</h3>
                <p>${article.description}</p>

                <span class="article-category">
                    ${article.category}
                </span>

                <span class="article-date">
                    ${article.displayDate}
                </span>
            </div>

        </a>
    `;
}

// ------------------------------------------------------------------------------------
// HOMEPAGE ARTICLES
// Creates the Featured and Latest article sections
// ------------------------------------------------------------------------------------
function displayArticles(articles) {

    // Clear old cards before adding new ones, prevents duplicates
    featuredContainer.innerHTML = "";
    latestContainer.innerHTML = "";

    // Go through every article in the JSON file
    articles.forEach(article => {

        // Create the card once
        const card = createCard(article);

        // Put all articles in Latest
        latestContainer.innerHTML += card;

        // Also put featured articles in Featured
        if (article.featured) {
            featuredContainer.innerHTML += card;
        }
    });
};

// ------------------------------------------------------------------------------------
// DISPLAY SEARCH RESULT
// Uses the same card creator as Featured/Latest
// ------------------------------------------------------------------------------------
function displayCards(articles, container) {

    // Remove previous search results
    container.innerHTML = "";

    // Create a card for every matching article
    articles.forEach(article => {
        container.innerHTML += createCard(article);
    });
}