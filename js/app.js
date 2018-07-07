const form = document.querySelector('#search-form');
const searchField = document.querySelector('#search-keyword');
let searchedForText;
const responseContainer = document.querySelector('#response-container');
let imagesContainer = document.querySelector('#images'),
    articlesContainer = document.querySelector('#articles');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    searchedForText = searchField.value;
    imagesRequest();
    articleRequest();
});
// set usplash API "image request"
function imagesRequest() {
    fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
        headers: {
            Authorization: 'Client-ID 7210b5c5405f766b2f0298ae731709557a8a7275688387c5162150342d228255'
        }
    }).then(response => response.json())
        .then(addImage)
        .catch(err => requestError(err, 'image'));
}

function addImage(data) {
    let htmlContent = '';
    if (data && data.results) {
        htmlContent = data.results.map(img => `<figure>
            <img src="${img.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${img.user.name}</figcaption>
        </figure>`).join('');
    } else {
        htmlContent = '<div class="error-no-image">No images available</div>';
    }
    imagesContainer.insertAdjacentHTML('afterbegin', htmlContent);
}

// set NYT API "article request"
function articleRequest() {
    fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=2673bdbbdee9493ba01ac2e41ed8d941`)
        .then(response => response.json())
        .then(addArticles)
        .catch(err => requestError(err, 'article'));

}
// search for an Article in NYT which not using Request header
function addArticles(data) {
    let htmlContent = '';
    // convert response from json to html object
    if (data && data.response && data.response.docs && data.response.docs.length > 1) {
        // if more than on articule has been returned maps over each article and then returns a list item that contains the article's
        htmlContent = '<ul>' + data.response.docs.map(article => `
            <li class='article'>
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
            </li>`).join('') + '</ul>';
    } else {
        htmlContent = '<div class="error-no-articles">No articles available</div>';
    }
    articlesContainer.insertAdjacentHTML('beforeend', htmlContent);
}
function requestError(err, part) {
    console.log(err);
    responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
}
